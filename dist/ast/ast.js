"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WhileStatement = exports.IfStatement = exports.PlusStatement = exports.MinusStatement = exports.PrintLineStatement = exports.PrintStatement = exports.FuckStatement = exports.BinaryExpressionStatement = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BinaryExpressionStatement =
/*#__PURE__*/
function () {
  function BinaryExpressionStatement(left, operator, right) {
    _classCallCheck(this, BinaryExpressionStatement);

    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  _createClass(BinaryExpressionStatement, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.left, " ").concat(this.operator, " ").concat(this.right);
    }
  }]);

  return BinaryExpressionStatement;
}();

exports.BinaryExpressionStatement = BinaryExpressionStatement;

var FuckStatement =
/*#__PURE__*/
function () {
  function FuckStatement(name, value) {
    _classCallCheck(this, FuckStatement);

    this.name = name;
    this.value = value;
  }

  _createClass(FuckStatement, [{
    key: "toString",
    value: function toString() {
      return "fuck ".concat(this.name, " -> ").concat(this.value);
    }
  }]);

  return FuckStatement;
}();

exports.FuckStatement = FuckStatement;

var PrintStatement =
/*#__PURE__*/
function () {
  function PrintStatement(type, name, value) {
    _classCallCheck(this, PrintStatement);

    this.type = type;
    this.name = name;
    this.value = value;
  }

  _createClass(PrintStatement, [{
    key: "toString",
    value: function toString() {
      return "print -> ".concat(this.name);
    }
  }]);

  return PrintStatement;
}();

exports.PrintStatement = PrintStatement;

var PrintLineStatement =
/*#__PURE__*/
function () {
  function PrintLineStatement(type, name, value) {
    _classCallCheck(this, PrintLineStatement);

    this.type = type;
    this.name = name;
    this.value = value;
  }

  _createClass(PrintLineStatement, [{
    key: "toString",
    value: function toString() {
      return "printLine -> ".concat(this.name);
    }
  }]);

  return PrintLineStatement;
}();

exports.PrintLineStatement = PrintLineStatement;

var MinusStatement =
/*#__PURE__*/
function () {
  function MinusStatement(name) {
    _classCallCheck(this, MinusStatement);

    this.name = name;
  }

  _createClass(MinusStatement, [{
    key: "toString",
    value: function toString() {
      return "minus -> ".concat(this.name);
    }
  }]);

  return MinusStatement;
}();

exports.MinusStatement = MinusStatement;

var PlusStatement =
/*#__PURE__*/
function () {
  function PlusStatement(name) {
    _classCallCheck(this, PlusStatement);

    this.name = name;
  }

  _createClass(PlusStatement, [{
    key: "toString",
    value: function toString() {
      return "plus -> ".concat(this.name);
    }
  }]);

  return PlusStatement;
}();

exports.PlusStatement = PlusStatement;

var IfStatement =
/*#__PURE__*/
function () {
  function IfStatement(condition, establish, contrary) {
    _classCallCheck(this, IfStatement);

    this.condition = condition;
    this.establish = establish;
    this.contrary = contrary;
  }

  _createClass(IfStatement, [{
    key: "toString",
    value: function toString() {
      if (contrary != undefined) {
        return "if ".concat(this.condition, " {\n                ").concat(this.establish, "\n            } else {\n                ").concat(this.contrary, "\n            }");
      } else {
        return "if ".concat(this.condition, " {\n                ").concat(this.establish, "\n            }");
      }
    }
  }]);

  return IfStatement;
}();

exports.IfStatement = IfStatement;

var WhileStatement =
/*#__PURE__*/
function () {
  function WhileStatement(condition, establish) {
    _classCallCheck(this, WhileStatement);

    this.condition = condition;
    this.establish = establish;
  }

  _createClass(WhileStatement, [{
    key: "toString",
    value: function toString() {
      return "while ".concat(this.condition, " {\n            ").concat(this.establish, "\n        }");
    }
  }]);

  return WhileStatement;
}();

exports.WhileStatement = WhileStatement;