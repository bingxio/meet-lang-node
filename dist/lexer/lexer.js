"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newToken = exports.tokenizer = void 0;

var _token = require("../token/token");

var current = 0;
var tokens = [];
var WHITESPACE = /\s/;
var NUMBERS = /[0-9]/;
var LETTERS = /[a-z|A-Z]/i;

var tokenizer = function tokenizer(code) {
  while (current < code.length) {
    var char = code[current];

    if (char == '#') {
      char = code[++current];

      while (char != '#') {
        char = code[++current];

        if (current == code.length) {
          throw new SyntaxError('注释必须以 # 结束，并一一对应');
        }
      }

      current++;
      continue;
    }

    if (char == '(') {
      newToken('paren', '(');
      current++;
      continue;
    }

    if (char == ')') {
      newToken('paren', ')');
      current++;
      continue;
    }

    if (char == '"') {
      var value = '';
      char = code[++current];

      while (char != '"') {
        value += char;
        char = code[++current];
      }

      newToken('string', value);
      current++;
      continue;
    } /////////////////////////////////////////////


    if (char == '-' && code[++current] == '>') {
      newToken('operator', '->');
      current++;
      continue;
    }

    if (char == '>' && code[++current] == '=') {
      newToken('operator', '>=');
      current++;
      continue;
    }

    if (char == '<' && code[++current] == '=') {
      newToken('operator', '<=');
      current++;
      continue;
    }

    if (char == '!' && code[++current] == '=') {
      newToken('operator', '!=');
      current++;
      continue;
    }

    if (char == '=' && code[++current] == '=') {
      newToken('operator', '==');
      current++;
      continue;
    } /////////////////////////////////////////////


    if (char == '+' || char == '-' || char == '*' || char == '/' || char == ';' || char == ',' || char == '>' || char == '<' || char == '{' || char == '}' || char == '=') {
      newToken('operator', char);
      current++;
      continue;
    }

    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    if (NUMBERS.test(char)) {
      var _value = '';

      while (NUMBERS.test(char)) {
        _value += char;
        char = code[++current];
      }

      newToken('number', _value);
      continue;
    }

    if (LETTERS.test(char)) {
      var _value2 = '';

      while (LETTERS.test(char) && typeof char != 'undefined') {
        _value2 += char;
        char = code[++current];
      }

      newToken('name', _value2);
      continue;
    }

    throw new TypeError('我不知道这个字符是什么：' + char);
  }

  newToken('EOF', 'EOF');
  return tokens;
};

exports.tokenizer = tokenizer;

var newToken = function newToken(type, value) {
  var token = new _token.Token(type, value);
  tokens.push(token);
};

exports.newToken = newToken;