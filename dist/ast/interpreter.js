"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Interpreter = void 0;

var _ast = require("./ast");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LETTERS = /[a-z|A-Z]/;

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
      this.env.set(name, value);
      this.current++;
    }
    /**
     * { name: 'a' }
     */

  }, {
    key: "evalPrintStatementNode",
    value: function evalPrintStatementNode() {
      if (this.node.type == 'string') {
        this.logWithOutLine(this.node.value);
        this.current++;
        return;
      }

      var name = this.node.name;

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
     * 解析二元判断表达式
     */

  }, {
    key: "evalBinaryExpressionNode",
    value: function evalBinaryExpressionNode(ast) {
      var left = ast[0].value;
      var operator = ast[1].value;
      var right = ast[2].value;

      if (this.isVariableType(left)) {
        left = this.env.get(left);
      }

      if (this.isVariableType(right)) {
        right = this.env.get(right);
      }

      if (typeof left == 'undefined' || typeof right == 'undefined') {
        throw new TypeError("\u672A\u77E5\u7684\u53D8\u91CF\u7C7B\u578B\uFF1Aleft = ".concat(left, ", right = ").concat(right));
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
          throw new TypeError("\u672A\u77E5\u7684\u64CD\u4F5C\u6570\uFF1A".concat(operator));
      }
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
        for (var _i = 0; _i < ifStmt.contrary.length; _i++) {
          this.refreshNodeWithOther(ifStmt.contrary[_i]);
          this.evalWithNode(ifStmt.contrary[_i]);
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