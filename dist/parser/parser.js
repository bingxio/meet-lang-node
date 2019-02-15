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
      };

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
          throw new SyntaxError("\u672A\u77E5\u7684\u7C7B\u578B\uFF1A".concat(this.token.toString(), ", at line: ").concat(this.line));
      }
    }
    /**
     * fuck a -> 200;
     * fuck a -> (20 + 5);
     * fuck a -> [2 4 6 8 10];
     * fuck a -> (list[a] + list[b])
     */

  }, {
    key: "parseFuckStatement",
    value: function parseFuckStatement() {
      var nameToken = this.tokens[++this.current];
      this.isLetter();
      this.current++;
      this.isPointer();
      var valueToken = this.tokens[++this.current];
      var valueExp = [];
      var valueListExp = [];
      var valueExpressionStmt = new _ast.BinaryExpressionStatement();
      var valueListExpressionStmt = new _ast.ListStatement();

      if (valueToken.value == '(') {
        this.current++;

        while (!this.isToken(')')) {
          valueExp.push(this.tokens[this.current++]);
        }

        if (typeof valueExp != 'undefined') {
          if (valueExp.length > 3 || valueExp.length < 3) {
            throw new SyntaxError("\u64CD\u4F5C\u6570\u9519\u8BEF\uFF1A".concat(valueExp));
          }
        }

        valueExpressionStmt.left = valueExp[0];
        valueExpressionStmt.operator = valueExp[1];
        valueExpressionStmt.right = valueExp[2];
      } else if (valueToken.value == '[') {
        this.current++;

        while (!this.isToken(']')) {
          valueExp.push(this.tokens[this.current++]);
        }

        if (valueExp.length == 0) {
          valueListExpressionStmt.type = 'empty';
          valueListExpressionStmt.value = [];
        } else {
          var tempCurrent = 0;
          var listVariableType = valueExp[0].type;

          while (tempCurrent < valueExp.length) {
            var v = valueExp[tempCurrent];

            if (listVariableType == v.type) {
              valueListExp.push(v.value);
            } else if (v.type == 'operator' && v.value == ',') {
              tempCurrent++;
              continue;
            } else {
              throw new SyntaxError("\u7F3A\u5C11\u9017\u53F7\u6216\u7A7A\u767D\u5B57\u7B26\u8FDB\u884C\u5206\u5272\uFF1A".concat(valueExp));
            }

            tempCurrent++;
          }

          valueListExpressionStmt.type = listVariableType;
          valueListExpressionStmt.value = valueListExp;
        }
      } else {
        this.parseVariableType(valueToken);
      }

      if (valueExpressionStmt.operator != undefined) {
        var _fuckStmt = new _ast.FuckStatement(nameToken.value, valueExpressionStmt);

        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return _fuckStmt;
      }

      if (valueListExpressionStmt.type != undefined) {
        var _fuckStmt2 = new _ast.FuckStatement(nameToken.value, valueListExpressionStmt);

        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return _fuckStmt2;
      }

      var fuckStmt = new _ast.FuckStatement(nameToken.value, valueToken.value);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
      return fuckStmt;
    }
    /**
     * print -> a;
     */

  }, {
    key: "parsePrintStatement",
    value: function parsePrintStatement() {
      this.current++;
      var printStmt; // 按制定的数量输出换行

      if (NUMBER.test(this.currentToken().value)) {
        printStmt = new _ast.PrintStatement('line', undefined, this.currentToken().value);
        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printStmt;
      } // 按变量输出指定个数的换行


      if (LETTER.test(this.currentToken().value)) {
        printStmt = new _ast.PrintStatement('line', this.currentToken().value, undefined);
        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printStmt;
      }

      this.isPointer();
      var valueToken = this.tokens[++this.current];

      if (valueToken.type == 'string') {
        printStmt = new _ast.PrintStatement('string', undefined, valueToken.value);
        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printStmt;
      }

      this.parseVariableType(valueToken);
      printStmt = new _ast.PrintStatement('name', valueToken.value, undefined);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
      return printStmt;
    }
    /**
     * printLine -> a
     * printLine -> list[0];
     */

  }, {
    key: "parsePrintLineStatement",
    value: function parsePrintLineStatement() {
      this.current++;
      var printLineStmt; // 按制定的数量输出换行

      if (NUMBER.test(this.currentToken().value)) {
        printLineStmt = new _ast.PrintLineStatement('line', undefined, this.currentToken().value);
        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printLineStmt;
      } // 按变量输出指定个数的换行


      if (LETTER.test(this.currentToken().value)) {
        printLineStmt = new _ast.PrintLineStatement('line', this.currentToken().value, undefined);
        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printLineStmt;
      }

      if (this.currentToken().value != '->') {
        printLineStmt = new _ast.PrintLineStatement();
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printLineStmt;
      }

      var valueToken = this.tokens[++this.current];

      if (valueToken.type == 'string') {
        printLineStmt = new _ast.PrintLineStatement('string', undefined, valueToken.value);
        this.current++;
        this.parseSemicolon();
        this.current++;
        this.line++;
        return printLineStmt;
      }

      this.parseVariableType(valueToken);
      printLineStmt = new _ast.PrintLineStatement('name', valueToken.value, undefined);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
      return printLineStmt;
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
     * forEach -> list;
     */

  }, {
    key: "parseForEachStatement",
    value: function parseForEachStatement() {
      this.current++;
      this.isPointer();
      this.current++;
      var valueToken = this.tokens[this.current];
      this.isLetter();
      var forEachStmt = new _ast.ForEachStatement(valueToken.value);
      this.current++;
      this.parseSemicolon();
      this.current++;
      this.line++;
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

  }, {
    key: "parseIfStatement",
    value: function parseIfStatement() {
      this.current++;
      var conditionStmt = [];
      var establishStmt = [];
      var contraryStmt = [];
      var conditionHasParenStmt = [];
      var conditionExpressionStmt = new _ast.BinaryExpressionStatement();

      while (!this.isToken('{')) {
        if (this.isToken('(')) {
          this.current++;

          while (!this.isToken(')')) {
            conditionHasParenStmt.push(this.tokens[this.current++]);
          }

          if (typeof conditionHasParenStmt != 'undefined') {
            if (conditionHasParenStmt.length > 3 || conditionHasParenStmt.length < 3) {
              throw new SyntaxError("\u64CD\u4F5C\u6570\u9519\u8BEF\uFF1A".concat(conditionHasParenStmt));
            }
          }

          conditionExpressionStmt.left = conditionHasParenStmt[0];
          conditionExpressionStmt.operator = conditionHasParenStmt[1];
          conditionExpressionStmt.right = conditionHasParenStmt[2];
          conditionStmt.push(conditionExpressionStmt);
          this.current++;
        } else {
          conditionStmt.push(this.tokens[this.current++]);
        }
      }

      if (conditionStmt.length > 3) {
        throw new SyntaxError("\u4EC5\u652F\u6301\u4E8C\u5143\u8868\u8FBE\u5F0F\uFF0C\u6761\u4EF6\uFF1A".concat(conditionStmt));
      }

      this.refreshToken(this.current++);

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
      var conditionHasParenStmt = [];
      var conditionExpressionStmt = new _ast.BinaryExpressionStatement();

      while (!this.isToken('{')) {
        if (this.isToken('(')) {
          this.current++;

          while (!this.isToken(')')) {
            conditionHasParenStmt.push(this.tokens[this.current++]);
          }

          if (typeof conditionHasParenStmt != 'undefined') {
            if (conditionHasParenStmt.length > 3 || conditionHasParenStmt.length < 3) {
              throw new SyntaxError("\u64CD\u4F5C\u6570\u9519\u8BEF\uFF1A".concat(conditionHasParenStmt));
            }
          }

          conditionExpressionStmt.left = conditionHasParenStmt[0];
          conditionExpressionStmt.operator = conditionHasParenStmt[1];
          conditionExpressionStmt.right = conditionHasParenStmt[2];
          conditionStmt.push(conditionExpressionStmt);
          this.current++;
        } else {
          conditionStmt.push(this.tokens[this.current++]);
        }
      }

      if (conditionStmt.length > 3) {
        throw new SyntaxError("\u4EC5\u652F\u6301\u4E8C\u5143\u8868\u8FBE\u5F0F\uFF0C\u6761\u4EF6\uFF1A".concat(conditionStmt));
      }

      this.refreshToken(this.current++);

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

  }, {
    key: "parseForStatement",
    value: function parseForStatement() {
      this.current++;
      this.parseLeftBrace();
      this.refreshToken(this.current++);
      var establishStmt = [];

      while (!this.isToken('}')) {
        this.parseWithTokenType(establishStmt);
        this.refreshToken(this.current);
      }

      var forStmt = new _ast.ForStatement(establishStmt);
      this.current++;
      this.line++;
      return forStmt;
    }
    /**
     * break;
     */

  }, {
    key: "parseBreakStatement",
    value: function parseBreakStatement() {
      this.current++;
      this.parseSemicolon();
      var breakStmt = new _ast.BreakStatement();
      this.current++;
      return breakStmt;
    }
    /**
     * set list[0] -> 6;
     * set list[a] -> (list[a] + list[b]);
     */

  }, {
    key: "parseSetStatement",
    value: function parseSetStatement() {
      this.current++;
      var name = this.currentToken();
      this.current++;
      this.isPointer();
      this.current++;
      var value = this.currentToken();
      var valueExpressionStmt = new _ast.BinaryExpressionStatement();
      var valueExp = [];

      if (value.value == '(') {
        this.current++;

        while (!this.isToken(')')) {
          valueExp.push(this.tokens[this.current++]);
        }

        if (typeof valueExp != 'undefined') {
          if (valueExp.length > 3 || valueExp.length < 3) {
            throw new SyntaxError("\u64CD\u4F5C\u6570\u9519\u8BEF\uFF1A".concat(valueExp));
          }
        }

        valueExpressionStmt.left = valueExp[0];
        valueExpressionStmt.operator = valueExp[1];
        valueExpressionStmt.right = valueExp[2];

        var _setStmt = new _ast.SetStatement('exp', name.value, valueExpressionStmt);

        this.current++;
        this.parseSemicolon();
        this.current++;
        return _setStmt;
      }

      this.current++;
      this.parseSemicolon();
      this.current++;
      var setStmt = new _ast.SetStatement('value', name.value, value.value);
      return setStmt;
    }
    /**
     * fun a => {
     *     printLine -> hello;
     * }
     */

  }, {
    key: "parseFunStatement",
    value: function parseFunStatement() {
      this.current++;
      this.isLetter();
      var name = this.currentToken();
      var establish = [];

      if (this.isToken('->')) {
        this.current++;
        var callFunStmt = new _ast.CallFunStatement(this.currentToken().value);
        this.current++;
        this.parseSemicolon();
        this.current++;
        return callFunStmt;
      }

      this.current++;

      if (!this.isToken('=>')) {
        throw new SyntaxError("\u7F3A\u5C11\u51FD\u6570\u6307\u9488\uFF1A".concat(this.currentToken()));
      }

      this.current++;
      this.parseLeftBrace();
      this.refreshToken(this.current++);

      while (!this.isToken('}')) {
        this.parseWithTokenType(establish);
        this.refreshToken(this.current);
      }

      var funStmt = new _ast.DefineFunStatement(name.value, establish);
      this.current++;
      return funStmt;
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
     * 检查当前是不是大括号
     */

  }, {
    key: "parseLeftBrace",
    value: function parseLeftBrace() {
      if (this.tokens[this.current].value != '{') {
        throw new SyntaxError("\u7F3A\u5C11\u5927\u62EC\u53F7 at line: ".concat(this.line + 1));
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