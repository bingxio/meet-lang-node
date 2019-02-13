"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = void 0;

var _ast = require("../ast/ast");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LETTER = /[a-z|A-Z]/;
var NUMBER = /[0-9]/;

var Parser =
/*#__PURE__*/
function () {
  function Parser(tokens) {
    _classCallCheck(this, Parser);

    this.tokens = tokens;
    this.current = 0;
    this.token = undefined;
    this.line = 1;
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse() {
      var ast = {
        type: 'Program',
        body: []
      }; // console.log(this.parseBinaryExpressionStatement('12 + 50'));

      while (this.current < this.tokens.length && this.currentToken().type != 'EOF') {
        this.token = this.tokens[this.current];
        this.parseWithTokenType(ast.body);
      }

      return ast;
    }
  }, {
    key: "parseWithTokenType",
    value: function parseWithTokenType(ast) {
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
          throw new SyntaxError("\u672A\u77E5\u7684\u7C7B\u578B\uFF1A".concat(this.token.toString(), ", at line: ").concat(this.line));
      }
    }
    /**
     * fuck a -> 200
     */

  }, {
    key: "parseFuckStatement",
    value: function parseFuckStatement() {
      var nameToken = this.tokens[++this.current];
      this.isLetter();
      this.current++;
      this.isPointer();
      var valueToken = this.tokens[++this.current];
      this.parseVariableType(valueToken);
      var fuckStmt = new _ast.FuckStatement(nameToken.value, valueToken.value);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
      return fuckStmt;
    }
    /**
     * print -> a
     */

  }, {
    key: "parsePrintStatement",
    value: function parsePrintStatement() {
      this.current++;
      this.isPointer();
      var printStmt;
      var valueToken = this.tokens[++this.current];

      if (valueToken.type == 'string') {
        printStmt = new _ast.PrintStatement('string', valueToken.value);
        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printStmt;
      }

      this.parseVariableType(valueToken);
      printStmt = new _ast.PrintStatement('name', valueToken.value);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
      return printStmt;
    }
    /**
     * printLine -> a
     */

  }, {
    key: "parsePrintLineStatement",
    value: function parsePrintLineStatement() {
      this.current++;
      var printLineStmt;

      if (this.tokens[this.current].value != '->') {
        printLineStmt = new _ast.PrintLineStatement();
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printLineStmt;
      }

      var valueToken = this.tokens[++this.current];

      if (valueToken.type == 'string') {
        printLineStmt = new _ast.PrintLineStatement('string', valueToken.value);
        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printLineStmt;
      }

      this.parseVariableType(valueToken);
      printLineStmt = new _ast.PrintLineStatement('name', valueToken.value);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
      return printLineStmt;
    }
    /**
     * 解析二元表达式、检查运算符个数
     */

  }, {
    key: "parseBinaryExpressionStatement",
    value: function parseBinaryExpressionStatement(exp) {
      var current = 0;
      var hasOperatorCounts = 0;

      while (current < exp.length) {
        var char = exp[current];

        if (char == '+' || char == '-' || char == '*' || char == '/' || char == '%') {
          hasOperatorCounts++;
        }

        current++;
      }

      if (hasOperatorCounts > 1) {
        throw new SyntaxError('仅支持二元表达式');
      }

      return hasOperatorCounts == 1;
    }
    /**
     * minus -> a;
     */

  }, {
    key: "parseMinusStatement",
    value: function parseMinusStatement() {
      this.current++;
      this.isPointer();
      this.current++;
      var valueToken = this.tokens[this.current];
      this.isLetter();
      var minusStmt = new _ast.MinusStatement(valueToken.value);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
      return minusStmt;
    }
    /**
     * plus -> a;
     */

  }, {
    key: "parsePlusStatement",
    value: function parsePlusStatement() {
      this.current++;
      this.isPointer();
      this.current++;
      var valueToken = this.tokens[this.current];
      this.isLetter();
      var plusStmt = new _ast.PlusStatement(valueToken.value);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
      return plusStmt;
    }
    /**
     * if a > 20 {
     *    print -> a;
     * } else {
     *    print -> b;
     * }
     */

  }, {
    key: "parseIfStatement",
    value: function parseIfStatement() {
      this.current++;
      var conditionStmt = [];
      var establishStmt = [];
      var contraryStmt = [];

      while (!this.isToken('{')) {
        conditionStmt.push(this.tokens[this.current]);
        this.current++;
      }

      if (conditionStmt.length > 3) {
        throw new SyntaxError("\u4EC5\u652F\u6301\u4E8C\u5143\u8868\u8FBE\u5F0F\uFF0C\u6761\u4EF6\uFF1A".concat(conditionStmt));
      }

      this.current++;
      this.refreshToken(this.current);

      while (!this.isToken('}')) {
        this.parseWithTokenType(establishStmt);
        this.refreshToken(this.current);
      }

      var ifStmt = new _ast.IfStatement(conditionStmt, establishStmt);
      this.current++;
      this.line++;

      if (this.isToken('else')) {
        this.current += 2;

        while (!this.isToken('}')) {
          this.parseWithTokenType(contraryStmt);
          this.refreshToken(this.current);
        }

        ifStmt.contrary = contraryStmt;
      } else {
        return ifStmt;
      }

      this.current++;
      this.line++;
      return ifStmt;
    }
    /**
     * while a < 20 {
     *     print -> a;
     * 
     *     plus -> a;
     * }
     */

  }, {
    key: "parseWhileStatement",
    value: function parseWhileStatement() {
      this.current++;
      var conditionStmt = [];
      var establishStmt = [];

      while (!this.isToken('{')) {
        conditionStmt.push(this.tokens[this.current]);
        this.current++;
      }

      if (conditionStmt.length > 3) {
        throw new SyntaxError("\u4EC5\u652F\u6301\u4E8C\u5143\u8868\u8FBE\u5F0F\uFF0C\u6761\u4EF6\uFF1A".concat(conditionStmt));
      }

      this.current++;
      this.refreshToken(this.current);

      while (!this.isToken('}')) {
        this.parseWithTokenType(establishStmt);
        this.refreshToken(this.current);
      }

      var whileStmt = new _ast.WhileStatement(conditionStmt, establishStmt);
      this.current++;
      this.line++;
      return whileStmt;
    }
    /**
     * 是否匹配变量的值规则
     */

  }, {
    key: "parseVariableType",
    value: function parseVariableType(t) {
      if (!LETTER.test(t.value) && !NUMBER.test(t.value)) {
        throw new TypeError("\u672A\u77E5\u7684\u53D8\u91CF\u7C7B\u578B\uFF1A".concat(this.currentToken(), ", at line: ").concat(this.line + 1));
      }
    }
    /**
     * 检查当前是不是分号
     */

  }, {
    key: "parseSemicolon",
    value: function parseSemicolon() {
      if (this.tokens[this.current].value != ';') {
        throw new SyntaxError("\u7F3A\u5C11\u5206\u53F7 at line: ".concat(this.line + 1));
      }

      return true;
    }
    /**
     * 检查是否匹配 token 的值
     */

  }, {
    key: "isToken",
    value: function isToken(v) {
      if (this.tokens[this.current].value == v) {
        return true;
      }

      return false;
    }
    /**
     * 检查当前是不是英文字符序列
     */

  }, {
    key: "isLetter",
    value: function isLetter() {
      if (!LETTER.test(this.tokens[this.current])) {
        throw new SyntaxError("\u53D8\u91CF\u540D\u53EA\u80FD\u662F\u82F1\u6587\u5B57\u7B26\u5E8F\u5217 at line: ".concat(this.line + 1));
      }

      return true;
    }
    /**
     * 检查当前是不是指针类型
     */

  }, {
    key: "isPointer",
    value: function isPointer() {
      if (this.tokens[this.current].value != '->') {
        throw new SyntaxError("\u7F3A\u5C11\u53D8\u91CF\u6307\u9488 at line: ".concat(this.line + 1));
      }

      return true;
    }
    /**
     * 刷新当前 token，使用缓存位置，用于递归解析
     */

  }, {
    key: "refreshToken",
    value: function refreshToken(position) {
      this.token = this.tokens[position];
    }
    /**
     * 返回当前 token
     */

  }, {
    key: "currentToken",
    value: function currentToken() {
      return this.tokens[this.current];
    }
    /**
     * 打印当前 token
     */

  }, {
    key: "showCurrentToken",
    value: function showCurrentToken() {
      console.log("".concat(this.tokens[this.current], ", at line: ").concat(this.line + 1));
    }
  }]);

  return Parser;
}();

exports.Parser = Parser;
;