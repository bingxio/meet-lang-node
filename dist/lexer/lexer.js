"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Lexer = void 0;

var _token = require("../token/token");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WHITESPACE = /\s/;
var NUMBERS = /[0-9]/;
var LETTERS = /[a-z|A-Z]/;

var Lexer =
/*#__PURE__*/
function () {
  function Lexer(code) {
    _classCallCheck(this, Lexer);

    this.code = code;
    this.tokens = [];
    this.current = 0;
  }

  _createClass(Lexer, [{
    key: "tokenizer",
    value: function tokenizer() {
      while (this.current < this.code.length) {
        var char = this.code[this.current];

        if (char == '#') {
          char = this.code[++this.current];

          while (char != '#') {
            char = this.code[++this.current];

            if (this.current == this.code.length) {
              throw new SyntaxError('注释必须以 # 结束，并一一对应');
            }
          }

          this.current++;
          continue;
        }

        if (char == '(') {
          this.newToken('paren', '(');
          this.current++;
          continue;
        }

        if (char == ')') {
          this.newToken('paren', ')');
          this.current++;
          continue;
        }

        if (char == '\'') {
          var value = '';
          char = this.code[++this.current];

          while (char != '\'') {
            value += char;
            char = this.code[++this.current];
          }

          this.newToken('string', value);
          this.current++;
          continue;
        } /////////////////////////////////////////////
        // if (char == '-' && this.code[++ this.current] == '>') {
        //     this.newToken('operator', '->');            
        //     this.current ++;
        //     continue;
        // }


        if ((char == '+' || char == '*' || char == '/' || char == '>' || char == '<' || char == '!' || char == '=') && this.code[++this.current] == '=') {
          this.newToken('operator', char += '=');
          this.current++;
          continue;
        }

        if (char == '-') {
          this.current++;

          if (this.code[this.current] == '>') {
            this.newToken('operator', '->');
            this.current++;
            continue;
          }

          if (this.code[this.current] == '=') {
            this.newToken('operator', '-=');
            this.current++;
            continue;
          }

          this.newToken('operator', '-');
          this.current++;
          continue;
        } /////////////////////////////////////////////


        if (char == '+' || char == '-' || char == '*' || char == '/' || char == ';' || char == ',' || char == '>' || char == '<' || char == '{' || char == '}' || char == '=' || char == '%') {
          this.newToken('operator', char);
          this.current++;
          continue;
        }

        if (WHITESPACE.test(char)) {
          this.current++;
          continue;
        }

        if (NUMBERS.test(char)) {
          var _value = '';

          while (NUMBERS.test(char)) {
            _value += char;
            char = this.code[++this.current];
          }

          this.newToken('number', _value);
          continue;
        }

        if (LETTERS.test(char)) {
          var _value2 = '';

          while (LETTERS.test(char) && typeof char != 'undefined') {
            _value2 += char;
            char = this.code[++this.current];
          }

          this.newToken('name', _value2);
          continue;
        }

        throw new TypeError('我不知道这个字符是什么：' + char);
      }

      this.newToken('EOF', 'EOF');
      return this.tokens;
    }
  }, {
    key: "newToken",
    value: function newToken(t, v) {
      var token = new _token.Token(t, v);
      this.tokens.push(token);
    }
  }]);

  return Lexer;
}();

exports.Lexer = Lexer;