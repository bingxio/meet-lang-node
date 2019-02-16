
import { FuckStatement, PrintStatement, PrintLineStatement, IfStatement, WhileStatement, MinusStatement, PlusStatement, BinaryExpressionStatement, 
    ListStatement, ForEachStatement, BreakStatement, ForStatement, DefineFunStatement, CallFunStatement, SetStatement } from '../ast/ast';

let LETTER = /[a-z|A-Z]/;
let NUMBER = /[0-9]/;

export class Parser {

    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
        this.token = undefined;
        this.line = 1;
    }

    parse() {
        let ast = {
            type: 'Program',
            body: []
        };

        while (this.current < this.tokens.length && this.currentToken().type != 'EOF') {
            this.token = this.tokens[this.current];
            this.parseWithTokenType(ast.body);
        }

        return ast;
    }

    parseWithTokenType(ast) {
        switch (this.token.value) {
            case 'fuck':
                ast.push(this.parseFuckStatement());
                break;
            case 'print':
                ast.push(this.parsePrintStatement());
                break;
            case 'printLine':
                ast.push(this.parsePrintLineStatement());
                break;
            case 'minus':
                ast.push(this.parseMinusStatement());
                break;
            case 'plus':
                ast.push(this.parsePlusStatement());
                break;
            case 'if':
                ast.push(this.parseIfStatement());
                break;
            case 'while':
                ast.push(this.parseWhileStatement());
                break;
            case 'for':
                ast.push(this.parseForStatement());
                break;
            case 'break':
                ast.push(this.parseBreakStatement());
                break;
            case 'forEach':
                ast.push(this.parseForEachStatement());
                break;
            case 'fun':
                ast.push(this.parseFunStatement());
                break;
            case 'set':
                ast.push(this.parseSetStatement());
                break;
            case '{':
                break;
            case '}':
                break;
            case 'EOF':
                break;
            default:
                throw new SyntaxError(`未知的类型：${this.token.toString()}, at line: ${this.line}`);
        }
    }

    /**
     * fuck a -> 200;
     * fuck a -> (20 + 5);
     * fuck a -> list[0];
     * fuck a -> 'Hello World';
     * fuck a -> [2 4 6 8 10];
     * fuck a -> (list[a] + list[b])
     */
    parseFuckStatement() {
        let nameToken = this.tokens[++ this.current];

        this.isLetter();
        this.current ++;
        this.isPointer();

        let valueToken = this.tokens[++ this.current];
        let valueExp = [];
        let valueListExp = [];

        let valueExpressionStmt = new BinaryExpressionStatement();
        let valueListExpressionStmt = new ListStatement();

        if (valueToken.value == '(') {
            this.current ++;
            
            while (! this.isToken(')')) {
                valueExp.push(this.tokens[this.current ++]);
            }

            if (typeof(valueExp) != 'undefined') {
                if (valueExp.length > 3 || valueExp.length < 3) {
                    throw new SyntaxError(`操作数错误：${valueExp}`);
                }
            }

            valueExpressionStmt.left = valueExp[0];
            valueExpressionStmt.operator = valueExp[1];
            valueExpressionStmt.right = valueExp[2];
        } else if(valueToken.value == '[') {
            this.current ++;

            while (! this.isToken(']')) {
                valueExp.push(this.tokens[this.current ++]);
            }

            if (valueExp.length == 0) {
                valueListExpressionStmt.type = 'empty';
                valueListExpressionStmt.value = [];
            } else {
                let tempCurrent = 0;
                let listVariableType = valueExp[0].type;

                while (tempCurrent < valueExp.length) {
                    let v = valueExp[tempCurrent];

                    if (listVariableType == v.type) {
                        valueListExp.push(v.value);
                    } else if (v.type == 'operator' && v.value == ',') {
                        tempCurrent ++;
                        continue;
                    } else {
                        throw new SyntaxError(`缺少逗号或空白字符进行分割：${valueExp}`);
                    }

                    tempCurrent ++;
                }

                valueListExpressionStmt.type = listVariableType;
                valueListExpressionStmt.value = valueListExp;
            }
        } else {
            this.parseVariableType(valueToken);
        }

        if (valueExpressionStmt.operator != undefined) {
            let fuckStmt = new FuckStatement(nameToken.value, valueExpressionStmt);

            this.current ++;
            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return fuckStmt;
        }

        if (valueListExpressionStmt.type != undefined) {
            let fuckStmt = new FuckStatement(nameToken.value, valueListExpressionStmt);

            this.current ++;
            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return fuckStmt;
        }

        let fuckStmt = new FuckStatement(nameToken.value, valueToken.value);

        this.current ++;
        this.parseSemicolon();
        this.current ++;
        this.line ++;

        return fuckStmt;
    }

    /**
     * print -> a;
     */
    parsePrintStatement() {
        this.current ++;

        let printStmt;

        // 按制定的数量输出换行
        if (NUMBER.test(this.currentToken().value)) {
            printStmt = new PrintStatement('line', undefined, this.currentToken().value);

            this.current ++;
            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return printStmt;
        }
        
        // 按变量输出指定个数的换行
        if (LETTER.test(this.currentToken().value)) {
            printStmt = new PrintStatement('line', this.currentToken().value, undefined);

            this.current ++;
            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return printStmt;
        }

        this.isPointer();

        let valueToken = this.tokens[++ this.current];

        if (valueToken.type == 'string') {
            printStmt = new PrintStatement('string', undefined, valueToken.value);
            
            this.current ++;
            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return printStmt;
        }
        
        this.parseVariableType(valueToken);

        printStmt = new PrintStatement('name', valueToken.value, undefined);

        this.current ++;
        this.parseSemicolon();
        this.current ++;
        this.line ++;

        return printStmt;
    }

    /**
     * printLine -> a
     * printLine -> list[0];
     */
    parsePrintLineStatement() {
        this.current ++;

        let printLineStmt;

        // 按制定的数量输出换行
        if (NUMBER.test(this.currentToken().value)) {
            printLineStmt = new PrintLineStatement('line', undefined, this.currentToken().value);

            this.current ++;
            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return printLineStmt;
        }
        
        // 按变量输出指定个数的换行
        if (LETTER.test(this.currentToken().value)) {
            printLineStmt = new PrintLineStatement('line', this.currentToken().value, undefined);

            this.current ++;
            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return printLineStmt;
        }

        if (this.currentToken().value != '->') {
            printLineStmt = new PrintLineStatement();

            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return printLineStmt;
        }

        let valueToken = this.tokens[++ this.current];

        if (valueToken.type == 'string') {
            printLineStmt = new PrintLineStatement('string', undefined, valueToken.value);

            this.current ++;
            this.parseSemicolon();
            this.current ++;
            this.line ++;

            return printLineStmt;
        }

        this.parseVariableType(valueToken);

        printLineStmt = new PrintLineStatement('name', valueToken.value, undefined);

        this.current ++;
        this.parseSemicolon();
        this.current ++;
        this.line ++;

        return printLineStmt;
    }

    /**
     * minus -> a;
     */
    parseMinusStatement() {
        this.current ++;
        this.isPointer();
        this.current ++;

        let valueToken = this.tokens[this.current];

        this.isLetter()

        let minusStmt = new MinusStatement(valueToken.value);

        this.current ++;
        this.parseSemicolon();
        this.current ++;
        this.line ++;

        return minusStmt;
    }

    /**
     * plus -> a;
     */
    parsePlusStatement() {
        this.current ++;
        this.isPointer();
        this.current ++;

        let valueToken = this.tokens[this.current];

        this.isLetter()

        let plusStmt = new PlusStatement(valueToken.value);

        this.current ++;
        this.parseSemicolon();
        this.current ++;
        this.line ++;

        return plusStmt;
    }

    /**
     * forEach -> list;
     */
    parseForEachStatement() {
        this.current ++;
        this.isPointer();
        this.current ++;

        let valueToken = this.tokens[this.current];

        this.isLetter();

        let forEachStmt = new ForEachStatement(valueToken.value);

        this.current ++;
        this.parseSemicolon();
        this.current ++;
        this.line ++;

        return forEachStmt;
    }

    /**
     * if a > 20 {
     *    print -> a;
     * } else {
     *    print -> b;
     * }
     * 
     * if (a % 2) == 0 {
     *    print -> a;
     * }
     */
    parseIfStatement() {
        this.current ++;

        let conditionStmt = [];
        let establishStmt = [];
        let contraryStmt = [];

        let conditionHasParenStmt = [];
        let conditionExpressionStmt = new BinaryExpressionStatement();

        while (! this.isToken('{')) {
            if (this.isToken('(')) {
                this.current ++;

                while (! this.isToken(')')) {
                    conditionHasParenStmt.push(this.tokens[this.current ++]);
                }

                if (typeof(conditionHasParenStmt) != 'undefined') {
                    if (conditionHasParenStmt.length > 3 || conditionHasParenStmt.length < 3) {
                        throw new SyntaxError(`操作数错误：${conditionHasParenStmt}`);
                    }
                }

                conditionExpressionStmt.left = conditionHasParenStmt[0];
                conditionExpressionStmt.operator = conditionHasParenStmt[1];
                conditionExpressionStmt.right = conditionHasParenStmt[2];

                conditionStmt.push(conditionExpressionStmt);

                this.current ++;
            } else {
                conditionStmt.push(this.tokens[this.current ++]);
            }
        }

        if (conditionStmt.length > 3) {
            throw new SyntaxError(`仅支持二元表达式，条件：${conditionStmt}`);
        }

        this.refreshToken(this.current ++);

        while (! this.isToken('}')) {
            this.parseWithTokenType(establishStmt);
            this.refreshToken(this.current);
        }

        let ifStmt = new IfStatement(conditionStmt, establishStmt);

        this.current ++;
        this.line ++;

        if (this.isToken('else')) {
            this.current += 2;

            while (! this.isToken('}')) {
                this.parseWithTokenType(contraryStmt);
                this.refreshToken(this.current);
            }

            ifStmt.contrary = contraryStmt;
        } else {
            return ifStmt;
        }

        this.current ++;
        this.line ++;

        return ifStmt;
    }

    /**
     * while a < 20 {
     *     print -> a;
     * 
     *     plus -> a;
     * }
     */
    parseWhileStatement() {
        this.current ++;

        let conditionStmt = [];
        let establishStmt = [];

        let conditionHasParenStmt = [];
        let conditionExpressionStmt = new BinaryExpressionStatement();

        while (! this.isToken('{')) {
            if (this.isToken('(')) {
                this.current ++;

                while (! this.isToken(')')) {
                    conditionHasParenStmt.push(this.tokens[this.current ++]);
                }

                if (typeof(conditionHasParenStmt) != 'undefined') {
                    if (conditionHasParenStmt.length > 3 || conditionHasParenStmt.length < 3) {
                        throw new SyntaxError(`操作数错误：${conditionHasParenStmt}`);
                    }
                }

                conditionExpressionStmt.left = conditionHasParenStmt[0];
                conditionExpressionStmt.operator = conditionHasParenStmt[1];
                conditionExpressionStmt.right = conditionHasParenStmt[2];

                conditionStmt.push(conditionExpressionStmt);

                this.current ++;
            } else {
                conditionStmt.push(this.tokens[this.current ++]);
            }
        }

        if (conditionStmt.length > 3) {
            throw new SyntaxError(`仅支持二元表达式，条件：${conditionStmt}`);
        }

        this.refreshToken(this.current ++);

        while (! this.isToken('}')) {
            this.parseWithTokenType(establishStmt);
            this.refreshToken(this.current);
        }

        let whileStmt = new WhileStatement(conditionStmt, establishStmt);

        this.current ++;
        this.line ++;

        return whileStmt;
    }

    /**
     * fuck a -> 0;
     * 
     * for {
     *     printLine -> a;
     * 
     *    if (a += 1) == 10 {
     *        break;
     *    }
     * }
     */
    parseForStatement() {
        this.current ++;
        this.parseLeftBrace();
        this.refreshToken(this.current ++);

        let establishStmt = [];

        while (! this.isToken('}')) {
            this.parseWithTokenType(establishStmt);
            this.refreshToken(this.current);
        }

        let forStmt = new ForStatement(establishStmt);

        this.current ++;
        this.line ++;

        return forStmt;
    }

    /**
     * break;
     */
    parseBreakStatement() {
        this.current ++;
        this.parseSemicolon();

        let breakStmt = new BreakStatement();

        this.current ++;

        return breakStmt;
    }

    /**
     * set list[0] -> 6;
     * set list[a] -> (list[a] + list[b]);
     */
    parseSetStatement() {
        this.current ++;

        let name = this.currentToken();

        this.current ++;
        this.isPointer();
        this.current ++;

        let value = this.currentToken();
        let valueExpressionStmt = new BinaryExpressionStatement();
        let valueExp = [];

        if (value.value == '(') {
            this.current ++;

            while (! this.isToken(')')) {
                valueExp.push(this.tokens[this.current ++]);
            }

            if (typeof(valueExp) != 'undefined') {
                if (valueExp.length > 3 || valueExp.length < 3) {
                    throw new SyntaxError(`操作数错误：${valueExp}`);
                }
            }

            valueExpressionStmt.left = valueExp[0];
            valueExpressionStmt.operator = valueExp[1];
            valueExpressionStmt.right = valueExp[2];

            let setStmt = new SetStatement('exp', name.value, valueExpressionStmt);

            this.current ++;
            this.parseSemicolon();
            this.current ++;

            return setStmt;
        }

        this.current ++;
        this.parseSemicolon();
        this.current ++;

        let setStmt = new SetStatement('value', name.value, value.value);

        return setStmt;
    }

    /**
     * fun a => {
     *     printLine -> hello;
     * }
     */
    parseFunStatement() {
        this.current ++;
        this.isLetter();

        let name = this.currentToken();
        let establish = [];

        if (this.isToken('->')) {
            this.current ++;

            let callFunStmt = new CallFunStatement(this.currentToken().value);

            this.current ++;
            this.parseSemicolon();
            this.current ++;

            return callFunStmt;
        }

        this.current ++;

        if (! this.isToken('=>')) {
            throw new SyntaxError(`缺少函数指针：${this.currentToken()}`);
        }

        this.current ++;
        this.parseLeftBrace();
        this.refreshToken(this.current ++);

        while (! this.isToken('}')) {
            this.parseWithTokenType(establish);
            this.refreshToken(this.current);
        }

        let funStmt = new DefineFunStatement(name.value, establish);

        this.current ++;

        return funStmt;
    }

    /**
     * 是否匹配变量的值规则
     */
    parseVariableType(t) {
        if (! LETTER.test(t.value) && ! NUMBER.test(t.value)) {
            throw new TypeError(`未知的变量类型：${this.currentToken()}, at line: ${this.line + 1}`)
        }
    }

    /**
     * 检查当前是不是分号
     */
    parseSemicolon() {
        if (this.tokens[this.current].value != ';') {
            throw new SyntaxError(`缺少分号 at line: ${this.line + 1}`);
        }
        return true;
    }

    /**
     * 检查当前是不是大括号
     */
    parseLeftBrace() {
        if (this.tokens[this.current].value != '{') {
            throw new SyntaxError(`缺少大括号 at line: ${this.line + 1}`);
        }
        return true;
    }

    /**
     * 检查是否匹配 token 的值
     */
    isToken(v) {
        if (this.tokens[this.current].value == v) {
            return true;
        }
        return false;
    }

    /**
     * 检查当前是不是英文字符序列
     */
    isLetter() {
        if (! LETTER.test(this.tokens[this.current])) {
            throw new SyntaxError(`变量名只能是英文字符序列 at line: ${this.line + 1}`);
        }
        return true;
    }

    /**
     * 检查当前是不是指针类型
     */
    isPointer() {
        if (this.tokens[this.current].value != '->') {
            throw new SyntaxError(`缺少变量指针 at line: ${this.line + 1}`);
        }
        return true;
    }

    /**
     * 刷新当前 token，使用缓存位置，用于递归解析
     */
    refreshToken(position) {
        this.token = this.tokens[position];
    }

    /**
     * 返回当前 token
     */
    currentToken() {
        return this.tokens[this.current];
    }

    /**
     * 打印当前 token
     */
    showCurrentToken() {
        console.log(`${this.tokens[this.current]}, at line: ${this.line + 1}`);
    }
};