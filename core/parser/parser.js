
import { FuckStatement, PrintStatement, PrintLineStatement, IfStatement, WhileStatement, MinusStatement, PlusStatement } from '../ast/ast';

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

        // console.log(this.parseBinaryExpressionStatement('12 + 50'));

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
     * fuck a -> 200
     */
    parseFuckStatement() {
        let nameToken = this.tokens[++ this.current];

        this.isLetter();
        this.current ++;
        this.isPointer();

        let valueToken = this.tokens[++ this.current];

        this.parseVariableType(valueToken);

        let fuckStmt = new FuckStatement(nameToken.value, valueToken.value);

        this.current ++;
        this.parseSemicolon();
        this.current ++;
        this.line ++;

        return fuckStmt;
    }

    /**
     * print -> a
     */
    parsePrintStatement() {
        this.current ++;
        this.isPointer();

        let printStmt;
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
     */
    parsePrintLineStatement() {
        this.current ++;

        let printLineStmt;

        if (this.tokens[this.current].value != '->') {
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
     * 解析二元表达式、检查运算符个数
     */
    parseBinaryExpressionStatement(exp) {
        let current = 0;
        let hasOperatorCounts = 0;

        while (current < exp.length) {
            let char = exp[current];

            if (char == '+' || char == '-' ||
                char == '*' || char == '/' ||
                char == '%') {
                    hasOperatorCounts ++;
                }
            current ++;
        }

        if (hasOperatorCounts > 1) {
            throw new SyntaxError('仅支持二元表达式');
        }

        return hasOperatorCounts == 1;
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
     * if a > 20 {
     *    print -> a;
     * } else {
     *    print -> b;
     * }
     */
    parseIfStatement() {
        this.current ++;

        let conditionStmt = [];
        let establishStmt = [];
        let contraryStmt = [];

        while (! this.isToken('{')) {
            conditionStmt.push(this.tokens[this.current]);
            this.current ++;
        }        

        if (conditionStmt.length > 3) {
            throw new SyntaxError(`仅支持二元表达式，条件：${conditionStmt}`);
        }

        this.current ++;
        this.refreshToken(this.current);

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

        while (! this.isToken('{')) {
            conditionStmt.push(this.tokens[this.current]);
            this.current ++;
        }

        if (conditionStmt.length > 3) {
            throw new SyntaxError(`仅支持二元表达式，条件：${conditionStmt}`);
        }

        this.current ++;
        this.refreshToken(this.current);

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