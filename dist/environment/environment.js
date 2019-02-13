"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Environment = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var variableMap = {};

var Environment =
/*#__PURE__*/
function () {
  function Environment() {
    _classCallCheck(this, Environment);
  }

  _createClass(Environment, [{
    key: "get",
    value: function get(k) {
      if (variableMap.hasOwnProperty(k)) {
        return variableMap[k];
      } else {
        return undefined;
      }
    }
  }, {
    key: "set",
    value: function set(k, v) {
      variableMap[k] = v;
    }
  }, {
    key: "has",
    value: function has(k) {
      return variableMap.hasOwnProperty(k);
    }
  }]);

  return Environment;
}();

exports.Environment = Environment;