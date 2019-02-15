"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Interpreter = void 0;

var _ast = require("./ast");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LETTERS = /[a-z|A-Z]/;
var LIST_LPAREN = /[\[]/;
var LIST_RPAREN = /[\]]/;
var breakForStatement = 1;

var Interpreter =
/*#__PURE__*/
function () {
  function Interpreter(ast, env) {
    _classCallCheck(this, Interpreter);

    this.ast = ast.body;
    this.env = env;
    this.node = undefined;
    this.current = 0;
  }

  _createClass(Interpreter, [{
    key: "eval",
    value: function _eval() {
      while (this.current < this.ast.length) {
        this.node = this.ast[this.current];
        this.evalWithNode(this.node);
      }
    }
  }, {
    key: "evalWithNode",
    value: function evalWithNode(node) {
      if (node instanceof _ast.FuckStatement) {
        this.evalFuckStatementNode();
      } else if (node instanceof _ast.PrintStatement) {
        this.evalPrintStatementNode();
      } else if (node instanceof _ast.PrintLineStatement) {
        this.evalPrintLineStatementNode();
      } else if (node instanceof _ast.IfStatement) {
        this.evalIfStatementNode();
      } else if (node instanceof _ast.WhileStatement) {
        this.evalWhileStatementNode();
      } else if (node instanceof _ast.MinusStatement) {
        this.evalMinusStatementNode();
      } else if (node instanceof _ast.PlusStatement) {
        this.evalPlusStatementNode();
      } else if (node instanceof _ast.ForEachStatement) {
        this.evalForEachStatementNode();
      } else if (node instanceof _ast.ForStatement) {
        this.evalForStatementNode();
      } else if (node instanceof _ast.DefineFunStatement) {
        this.evalDefineFunStatementNode();
      } else if (node instanceof _ast.CallFunStatement) {
        this.evalCallFunStatementNode();
      } else if (node instanceof _ast.BreakStatement) {
        breakForStatement = 0;
        this.current++;
      } else {
        throw new TypeError("\u89E3\u91CA\u5931\u8D25\uFF0C\u672A\u77E5\u7684\u7C7B\u578B\uFF1A".concat(node.toString()));
      }
    }
    /**
     * { name: 'a', value: '20' }
     */

  }, {
    key: "evalFuckStatementNode",
    value: function evalFuckStatementNode() {
      var name = this.node.name;
      var value = this.node.value;

      if (value instanceof _ast.BinaryExpressionStatement) {
        value = this.evalBinaryExpressionNode([value.left, value.operator, value.right]);
      }

      if (value instanceof _ast.ListStatement) {
        this.env.set(name, [value.type, value.value]);
        this.current++;
        return;
      }

      this.env.set(name, value);
      this.current++;
    }
    /**
     * { name: 'a' }
     */

  }, {
    key: "evalPrintStatementNode",
    value: function evalPrintStatementNode() {
      if (this.node.type == 'line' && typeof this.node.value != 'undefined') {
        for (var i = 0; i < parseInt(this.node.value); i++) {
          this.logWithOutLine(' ');
        }

        this.current++;
        return;
      }

      if (this.node.type == 'line' && typeof this.node.name != 'undefined') {
        var lineSize = this.env.get(this.node.name);

        if (typeof lineSize == 'undefined') {
          throw new SyntaxError("\u627E\u4E0D\u5230\u53D8\u91CF\uFF1A".concat(this.node.name));
        }

        for (var _i = 0; _i < parseInt(lineSize); _i++) {
          this.logWithOutLine(' ');
        }

        this.current++;
        return;
      }

      if (this.node.type == 'string') {
        this.logWithOutLine(this.node.value);
        this.current++;
        return;
      }

      var name = this.node.name;

      if (LIST_LPAREN.test(name) && LIST_RPAREN.test(name)) {
        var v = this.evalListExpressionNode(name);
        this.logWithOutLine(v);
        this.current++;
        return;
      }

      if (this.isVariableType(name)) {
        var value = this.env.get(name);

        if (typeof value == 'undefined') {
          throw new Error("\u627E\u4E0D\u5230\u53D8\u91CF\uFF1A".concat(name));
        } else {
          this.logWithOutLine(value);
        }
      } else {
        this.logWithOutLine(name);
      }

      this.current++;
    }
    /**
     * { name: 'a' }
     */

  }, {
    key: "evalPrintLineStatementNode",
    value: function evalPrintLineStatementNode() {
      if (this.node.type == 'line' && typeof this.node.value != 'undefined') {
        for (var i = 0; i < parseInt(this.node.value); i++) {
          this.logWithLine('');
        }

        this.current++;
        return;
      }

      if (this.node.type == 'line' && typeof this.node.name != 'undefined') {
        var lineSize = this.env.get(this.node.name);

        if (typeof lineSize == 'undefined') {
          throw new SyntaxError("\u627E\u4E0D\u5230\u53D8\u91CF\uFF1A".concat(this.node.name));
        }

        for (var _i2 = 0; _i2 < parseInt(lineSize); _i2++) {
          this.logWithLine('');
        }

        this.current++;
        return;
      }

      if (this.node.type == 'string') {
        this.logWithLine(this.node.value);
        this.current++;
        return;
      }

      var name = this.node.name;

      if (typeof name == 'undefined') {
        this.logWithLine('');
        this.current++;
        return;
      }

      if (LIST_LPAREN.test(name) && LIST_RPAREN.test(name)) {
        var v = this.evalListExpressionNode(name);
        this.logWithLine(v);
        this.current++;
        return;
      }

      if (this.isVariableType(name)) {
        var value = this.env.get(name);

        if (typeof value == 'undefined') {
          throw new Error("\u627E\u4E0D\u5230\u53D8\u91CF\uFF1A".concat(name));
        } else {
          this.logWithLine(value);
        }
      } else {
        this.logWithLine(name);
      }

      this.current++;
    }
    /**
     * { name: 'a' }
     */

  }, {
    key: "evalMinusStatementNode",
    value: function evalMinusStatementNode() {
      var name = this.node.name;

      if (!this.isVariableType(name)) {
        throw new TypeError("\u4E0D\u80FD\u76F4\u63A5\u5BF9\u503C\u8FDB\u884C\u51CF\u6CD5\uFF1A".concat(name, "\uFF0C\u4EC5\u9650\u53D8\u91CF"));
      }

      var value = this.env.get(name);

      if (typeof value == 'undefined') {
        throw new Error("\u627E\u4E0D\u5230\u53D8\u91CF\uFF1A".concat(name));
      }

      value = parseInt(value) - 1;
      this.env.set(name, value);
      this.current++;
    }
    /**
     * { name: 'a' }
     */

  }, {
    key: "evalPlusStatementNode",
    value: function evalPlusStatementNode() {
      var name = this.node.name;

      if (!this.isVariableType(name)) {
        throw new TypeError("\u4E0D\u80FD\u76F4\u63A5\u5BF9\u503C\u8FDB\u884C\u52A0\u6CD5\uFF1A".concat(name, "\uFF0C\u4EC5\u9650\u53D8\u91CF"));
      }

      var value = this.env.get(name);

      if (typeof value == 'undefined') {
        throw new Error("\u627E\u4E0D\u5230\u53D8\u91CF\uFF1A".concat(name));
      }

      value = parseInt(value) + 1;
      this.env.set(name, value);
      this.current++;
    }
    /**
     * { name: 'list' }
     */

  }, {
    key: "evalForEachStatementNode",
    value: function evalForEachStatementNode() {
      var name = this.node.name;

      if (!this.isVariableType(name)) {
        throw new TypeError("\u672A\u77E5\u7684\u5217\u8868\u540D\uFF1A".concat(name));
      }

      var list = this.env.get(name);
      var outPut = '';

      if (typeof list == 'undefined') {
        throw new SyntaxError("\u627E\u4E0D\u5230\u5217\u8868\uFF1A".concat(name));
      }

      list[1].forEach(function (v) {
        if (v != ',') outPut += v;
        outPut += ' ';
      });
      this.logWithLine(outPut);
      this.current++;
    }
    /**
     * 解析表达式、返回布尔值或表达式值
     */

  }, {
    key: "evalBinaryExpressionNode",
    value: function evalBinaryExpressionNode(ast) {
      var evalLeft = ast[0];
      var evalOperator = ast[1];
      var evalRight = ast[2];

      if (evalLeft instanceof _ast.BinaryExpressionStatement) {
        evalLeft = this.evalBinaryExpressionNode([evalLeft.left, evalLeft.operator, evalLeft.right]);
        evalOperator = ast[1].value;
        evalRight = ast[2].value;
      } else if (evalRight instanceof _ast.BinaryExpressionStatement) {
        evalLeft = ast[0].value;
        evalOperator = ast[1].value;
        evalRight = this.evalBinaryExpressionNode([evalRight.left, evalRight.operator, evalRight.right]);
      } else if (evalLeft.type == 'list') {
        evalLeft = this.evalListExpressionNode(evalLeft.value);

        if (evalRight.type == 'list') {
          evalRight = this.evalListExpressionNode(evalRight.value);
        }

        evalOperator = ast[1].value;
      } else {
        evalLeft = ast[0].value;
        evalOperator = ast[1].value;
        evalRight = ast[2].value;
      }

      if (this.isVariableType(evalLeft)) evalLeft = this.env.get(evalLeft);
      if (this.isVariableType(evalRight)) evalRight = this.env.get(evalRight);

      if (typeof evalLeft == 'undefined' || typeof evalRight == 'undefined') {
        throw new TypeError("\u672A\u77E5\u7684\u53D8\u91CF\u7C7B\u578B\uFF1Aleft = ".concat(evalLeft, ", operator = ").concat(evalOperator, ", right = ").concat(evalRight));
      }

      evalLeft = parseInt(evalLeft);
      evalRight = parseInt(evalRight);

      switch (evalOperator) {
        case '>':
          return evalLeft > evalRight;

        case '<':
          return evalLeft < evalRight;

        case '>=':
          return evalLeft >= evalRight;

        case '<=':
          return evalLeft <= evalRight;

        case '==':
          return evalLeft == evalRight;

        case '!=':
          return evalLeft != evalRight;

        case '+':
          return evalLeft + evalRight;

        case '-':
          return evalLeft - evalRight;

        case '*':
          return evalLeft * evalRight;

        case '/':
          return evalLeft / evalRight;

        case '%':
          return evalLeft % evalRight;

        case '+=':
          this.env.set(ast[0].value, evalLeft += evalRight);
          return ast[0].value;

        case '-=':
          this.env.set(ast[0].value, evalLeft -= evalRight);
          return ast[0].value;

        case '*=':
          this.env.set(ast[0].value, evalLeft *= evalRight);
          return ast[0].value;

        case '/=':
          this.env.set(ast[0].value, evalLeft /= evalRight);
          return ast[0].value;

        default:
          throw new TypeError("\u672A\u77E5\u7684\u64CD\u4F5C\u6570\uFF1A".concat(evalOperator));
      }
    }
    /**
     * 根据列表名，返回列表值
     * 
     * list[0] -> list -> 0
     */

  }, {
    key: "evalListExpressionNode",
    value: function evalListExpressionNode(name) {
      var listName = '';
      var listIndexName = '';
      var current = 0;

      while (current < name.length && name[current] != '[') {
        listName += name[current++];
      }

      current++;

      while (current < name.length && name[current] != ']') {
        listIndexName += name[current++];
      } // let listName = name.replace(/[^a-z|A-Z]/ig, '');
      // let listIndex = parseInt(name.replace(/[^0-9]/ig, ''));


      var list = this.env.get(listName);

      if (typeof list == 'undefined') {
        throw new SyntaxError("\u627E\u4E0D\u5230\u5217\u8868\uFF1A".concat(listName));
      }

      if (LETTERS.test(listIndexName)) {
        listIndexName = this.env.get(listIndexName);
      }

      if (typeof listIndexName == 'undefined') {
        throw new SyntaxError("\u627E\u4E0D\u5230\u53D8\u91CF\uFF1A".concat(listIndexName));
      }

      listIndexName = parseInt(listIndexName);
      return list[1][listIndexName];
    }
    /**
     * { condition: [{ name: 'a', operator: '>', name: '20' }], establish: [Array], contrary: [Array] }
     */

  }, {
    key: "evalIfStatementNode",
    value: function evalIfStatementNode() {
      var ifStmt = this.node;
      var condition = this.evalBinaryExpressionNode(ifStmt.condition);
      var tempCurrent = this.current;

      if (condition) {
        for (var i = 0; i < ifStmt.establish.length; i++) {
          this.refreshNodeWithOther(ifStmt.establish[i]);
          this.evalWithNode(ifStmt.establish[i]);
        }
      } else if (typeof ifStmt.contrary != 'undefined') {
        for (var _i3 = 0; _i3 < ifStmt.contrary.length; _i3++) {
          this.refreshNodeWithOther(ifStmt.contrary[_i3]);
          this.evalWithNode(ifStmt.contrary[_i3]);
        }
      }

      this.current = tempCurrent;
      this.current++;
    }
    /**
     * { condition: [{ name: 'a', operator: '>', name: '20' }], establish: [Array] }
     */

  }, {
    key: "evalWhileStatementNode",
    value: function evalWhileStatementNode() {
      var whileStmt = this.node;
      var condition = this.evalBinaryExpressionNode(whileStmt.condition);
      var tempCurrent = this.current;

      while (condition) {
        for (var i = 0; i < whileStmt.establish.length; i++) {
          this.refreshNodeWithOther(whileStmt.establish[i]);
          this.evalWithNode(whileStmt.establish[i]);
        }

        condition = this.evalBinaryExpressionNode(whileStmt.condition);
      }

      this.current = tempCurrent;
      this.current++;
    }
    /**
     * { establish: [Array] }
     */

  }, {
    key: "evalForStatementNode",
    value: function evalForStatementNode() {
      var establish = this.node.establish;
      var tempCurrent = this.current;

      while (breakForStatement == 1) {
        for (var i = 0; i < establish.length; i++) {
          this.refreshNodeWithOther(establish[i]);
          this.evalWithNode(establish[i]);
        }
      }

      this.current = tempCurrent;
      this.current++;
    }
    /**
     * { name: 'do', establish: [Array] }
     */

  }, {
    key: "evalDefineFunStatementNode",
    value: function evalDefineFunStatementNode() {
      var funStmt = this.node;
      this.env.set(funStmt.name, funStmt.establish);
      this.current++;
    }
    /**
     * { name: 'do' }
     */

  }, {
    key: "evalCallFunStatementNode",
    value: function evalCallFunStatementNode() {
      var callFunStmt = this.node;
      var establish = this.env.get(callFunStmt.name);
      var tempCurrent = this.current;
      var isVariable = this.env.get(callFunStmt.name);

      if (typeof isVariable == 'undefined') {
        throw new TypeError("\u627E\u4E0D\u5230\u51FD\u6570\uFF1A".concat(callFunStmt.name));
      } else if (_typeof(isVariable) != 'object') {
        throw new TypeError("".concat(callFunStmt.name, " \u662F\u4E00\u4E2A\u53D8\u91CF\u540D\uFF0C\u4E0D\u662F\u4E00\u4E2A\u51FD\u6570\u540D"));
      }

      if (typeof establish == 'undefined') {
        throw new TypeError("\u627E\u4E0D\u5230\u51FD\u6570\u8C03\u7528\uFF1A".concat(callFunStmt));
      }

      for (var i = 0; i < establish.length; i++) {
        this.refreshNodeWithOther(establish[i]);
        this.evalWithNode(establish[i]);
      }

      this.current = tempCurrent;
      this.current++;
    }
    /**
     * 判断是不是变量
     */

  }, {
    key: "isVariableType",
    value: function isVariableType(n) {
      return LETTERS.test(n);
    }
    /**
     * 刷新当前的节点
     */

  }, {
    key: "refreshNode",
    value: function refreshNode(position) {
      this.node = this.ast[position];
    }
    /**
     * 刷新指定的节点
     */

  }, {
    key: "refreshNodeWithOther",
    value: function refreshNodeWithOther(node) {
      this.node = node;
    }
    /**
     * 输出当前节点
     */

  }, {
    key: "showCurrentNode",
    value: function showCurrentNode() {
      console.log(this.ast[this.current]);
    }
    /**
     * 打印并且换行
     */

  }, {
    key: "logWithLine",
    value: function logWithLine(v) {
      process.stdout.write(v + '\n');
    }
    /**
     * 打印但是不换行
     */

  }, {
    key: "logWithOutLine",
    value: function logWithOutLine(v) {
      process.stdout.write(v);
    }
  }]);

  return Interpreter;
}();

exports.Interpreter = Interpreter;