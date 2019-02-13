
// export let variableMap = {};

// export let evaluate = ast => {
//     let current = 0;

//     let nodeList = ast.body;

//     while (current < nodeList.length) {
//         let node = nodeList[current];

//         if (node.type == 'DefineFuckExpression' &&
//             typeof(node.name) != 'undefined' &&
//             typeof(node.value) != 'undefined') {
//                 variableMap[node.name] = node.value;

//                 current ++;

//                 continue;
//         }

//         if ((node.type == 'PrintFuckExpression' && node.name != 'printLine') || (node.type == 'PrintLineFuckExpression' &&
//             typeof(node.name) != 'undefined')) {

//                 let nextNode = nodeList[++ current];

//                 if (typeof(nextNode) != 'undefined') {

//                     // 如果是计算表达式
//                     if (nextNode.type == 'ComputationalExpression' &&
//                         typeof(nextNode.name) != 'undefined' &&
//                         typeof(nextNode.param) != 'undefined') {
                        
//                             let left = nextNode.param[0].value;
//                             let right = nextNode.param[1].value;
                        
//                             let tLeft = 0;
//                             let tRight = 0;
//                             let num = 0;
                        
//                             if (parseInt(left) != NaN) tLeft = parseInt(left);
//                             if (parseInt(right) != NaN) tRight = parseInt(right);
                        
//                             if (variableMap.hasOwnProperty(left)) {
//                                 if (parseInt(variableMap[left]) != NaN)
//                                     tLeft = parseInt(variableMap[left]);
//                                 else
//                                     tLeft = variableMap[left];
//                             }

//                             if (variableMap.hasOwnProperty(right)) {
//                                 if (parseInt(variableMap[right]) != NaN)
//                                     tRight = parseInt(variableMap[right]);
//                                 else
//                                     tRight = variableMap[right];
//                             }

//                             switch (nextNode.name) {
//                                 case '+':
//                                     num = tLeft + tRight;
//                                     break;
//                                 case '-':
//                                     num = tLeft - tRight;
//                                     break;
//                                 case '*':
//                                     num = tLeft * tRight;
//                                     break;
//                                 case '/':
//                                     num = tLeft / tRight;
//                                     break;
//                             }

//                             console.log(num);

//                             // skip ComputationalExpression.
//                             current ++;

//                             continue;
//                     }
//                 }

//                 // 在库里找变量名和变量值
//                 if (variableMap.hasOwnProperty(node.name)) {
//                     if (node.type == 'PrintFuckExpression') process.stdout.write(variableMap[node.name]);
//                     if (node.type == 'PrintLineFuckExpression') console.log(variableMap[node.name]);
//                 } else {
//                     throw new SyntaxError('没有找到变量：' + node.name);
//                 }

//                 continue;
//         }

//         if (node.type == 'PrintFuckExpression' && node.name == 'printLine') {
//             console.log('');

//             current ++;

//             continue;
//         }

//         throw new TypeError(node.type);
//     }

//     return true;
// }

import { FuckStatement, PrintStatement, PrintLineStatement, IfStatement, WhileStatement, MinusStatement, PlusStatement } from "./ast";

let LETTERS = /[a-z|A-Z]/;

export class Interpreter {

    constructor(ast, env) {
        this.ast = ast.body;
        this.env = env;
        this.node = undefined;
        this.current = 0;
    }

    eval() {

        while (this.current < this.ast.length) {
            this.node = this.ast[this.current];
            this.evalWithNode(this.node);
        }
    }

    evalWithNode(node) {
        if (node instanceof FuckStatement) {
            this.evalFuckStatementNode();
        } else if (node instanceof PrintStatement) {
            this.evalPrintStatementNode();
        } else if (node instanceof PrintLineStatement) {
            this.evalPrintLineStatementNode();
        } else if (node instanceof IfStatement) {
            this.evalIfStatementNode();
        } else if (node instanceof WhileStatement) {
            this.evalWhileStatementNode();
        } else if (node instanceof MinusStatement) {
            this.evalMinusStatementNode();
        } else if (node instanceof PlusStatement) {
            this.evalPlusStatementNode();
        } else {
            throw new TypeError(`解释失败，未知的类型：${node.toString()}`);
        }
    }

    /**
     * { name: 'a', value: '20' }
     */
    evalFuckStatementNode() {
        let name = this.node.name;
        let value = this.node.value;

        this.env.set(name, value);
        this.current ++;
    }

    /**
     * { name: 'a' }
     */
    evalPrintStatementNode() {
        if(this.node.type == 'string') {
            this.logWithOutLine(this.node.name);
            return;
        }

        let name = this.node.name;

        if (this.isVariableType(name)) {
            let value = this.env.get(name);

            if (typeof(value) == 'undefined') {
                throw new Error(`找不到变量：${name}`);
            } else {
                this.logWithLine(value);
            }
        } else {
            this.logWithOutLine(name);
        }

        this.current ++;
    }

    /**
     * { name: 'a' }
     */
    evalPrintLineStatementNode() {
        if (this.node.type == 'string') {
            this.logWithLine(this.node.name);
            return;
        }

        let name = this.node.name;

        if (typeof(name) == 'undefined') {
            this.logWithLine('');
            this.current ++;

            return;
        }

        if (this.isVariableType(name)) {
            let value = this.env.get(name);

            if (typeof(value) == 'undefined') {
                throw new Error(`找不到变量：${name}`);
            } else {
                this.logWithLine(value);
            }
        } else {
            this.logWithLine(name);
        }

        this.current ++;
    }

    /**
     * { name: 'a' }
     */
    evalMinusStatementNode() {
        let name = this.node.name;

        if (! this.isVariableType(name)) {
            throw new TypeError(`不能直接对值进行减法：${name}，仅限变量`);
        }

        let value = this.env.get(name);

        if (typeof(value) == 'undefined') {
            throw new Error(`找不到变量：${name}`);
        }

        value = parseInt(value) - 1;

        this.env.set(name, value);
        this.current ++;
    }

    /**
     * { name: 'a' }
     */
    evalPlusStatementNode() {
        let name = this.node.name;

        if (! this.isVariableType(name)) {
            throw new TypeError(`不能直接对值进行加法：${name}，仅限变量`);
        }

        let value = this.env.get(name);

        if (typeof(value) == 'undefined') {
            throw new Error(`找不到变量：${name}`);
        }

        value = parseInt(value) + 1;

        this.env.set(name, value);
        this.current ++;
    }

    /**
     * 解析二元判断表达式
     */
    evalBinaryExpressionNode(ast) {
        let left = ast[0].value;
        let operator = ast[1].value;
        let right = ast[2].value;

        if (this.isVariableType(left)) {
            left = this.env.get(left);
        }

        if (this.isVariableType(right)) {
            right = this.env.get(right);
        }

        if (typeof(left) == 'undefined' || typeof(right) == 'undefined') {
            throw new TypeError(`未知的变量类型：left = ${left}, right = ${right}`);
        }

        left = parseInt(left);
        right = parseInt(right);

        switch (operator) {
            case '>':
                return left > right;
            case '<':
                return left < right;
            case '>=':
                return left >= right;
            case '<=':
                return left <= right;
            case '==':
                return left == right;
            case '!=':
                return left != right;
            default:
                throw new TypeError(`未知的操作数：${operator}`);
        }
    }

    /**
     * { condition: [{ name: 'a', operator: '>', name: '20' }], establish: [Array], contrary: [Array] }
     */
    evalIfStatementNode() {
        let ifStmt = this.node;
        let condition = this.evalBinaryExpressionNode(ifStmt.condition);
        let tempCurrent = this.current;

        if (condition) {
            for (let i = 0; i < ifStmt.establish.length; i ++) {
                this.refreshNodeWithOther(ifStmt.establish[i]);
                this.evalWithNode(ifStmt.establish[i]);
            }
        } else if (typeof(ifStmt.contrary) != 'undefined') {
            for (let i = 0; i < ifStmt.contrary.length; i ++) {
                this.refreshNodeWithOther(ifStmt.contrary[i]);
                this.evalWithNode(ifStmt.contrary[i]);
            }
        }

        this.current = tempCurrent;
        this.current ++;
    }

    /**
     * { condition: [{ name: 'a', operator: '>', name: '20' }], establish: [Array] }
     */
    evalWhileStatementNode() {
        let whileStmt = this.node;
        let condition = this.evalBinaryExpressionNode(whileStmt.condition);
        let tempCurrent = this.current;

        while (condition) {
            for (let i = 0; i < whileStmt.establish.length; i ++) {
                this.refreshNodeWithOther(whileStmt.establish[i]);
                this.evalWithNode(whileStmt.establish[i]);
            }

            condition = this.evalBinaryExpressionNode(whileStmt.condition);
        }

        this.current = tempCurrent;
        this.current ++;
    }

    /**
     * 判断是不是变量
     */
    isVariableType(n) {
        return LETTERS.test(n);
    }

    /**
     * 刷新当前的节点
     */
    refreshNode(position) {
        this.node = this.ast[position];
    }

    /**
     * 刷新指定的节点
     */
    refreshNodeWithOther(node) {
        this.node = node;
    }

    /**
     * 输出当前节点
     */
    showCurrentNode() {
        console.log(this.ast[this.current]);
    }

    /**
     * 打印并且换行
     */
    logWithLine(v) {
        console.log(v);
    }

    /**
     * 打印但是不换行
     */
    logWithOutLine(v) {
        process.stdout.write(v);
    }
}