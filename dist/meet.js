#!/usr/bin/env node

"use strict";

var _lexer = require("./lexer/lexer");

var _parser = require("./parser/parser");

var _interpreter = require("./ast/interpreter");

var _environment = require("./environment/environment");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _readline = _interopRequireDefault(require("readline"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shellWithFile = undefined;
var shellWithToken = false;
var shellWithShowAll = false;
var shellWithAst = false;
var shellWithSource = false;
var shellWithEnv = false;

var r1 = _readline.default.createInterface({
  input: process.stdin,
  output: process.stdout
});
/**
 * 公用存储变量表
 */


var environment = new _environment.Environment();

if (process.argv.length == 2) {
  process.stdout.write('Meet Programming Language REPL - Turaiiao 2019 - Email: 1171840237@qq.com \n> ');
  r1.on('line', function (input) {
    if (input == 'exit') {
      process.exit();
    }

    if (input != '' && input.length != 0) {
      interpreterLine(input);
      process.stdout.write('> ');
    } else {
      process.stdout.write('> ');
    }
  });
} else {
  if (process.argv[2] == '-token') {
    shellWithToken = true;
  } else if (process.argv[2] == '-ast') {
    shellWithAst = true;
  } else if (process.argv[2] == '-all') {
    shellWithShowAll = true;
  } else if (process.argv[2] == '-source') {
    shellWithSource = true;
  } else if (process.argv[2] == '-env') {
    shellWithEnv = true;
  } else {
    shellWithFile = process.argv[2];
  }

  if (shellWithToken || shellWithAst || shellWithShowAll || shellWithSource || shellWithEnv) {
    shellWithFile = process.argv[3];
  }

  var extname = _path.default.extname(shellWithFile);

  if (extname != '.meet') {
    throw new Error("\u672A\u77E5\u7684\u6587\u4EF6\u540E\u7F00\uFF1A".concat(extname, "\uFF0C\u4EC5\u9650 '.meet'"));
  }

  var source = _fs.default.readFileSync(shellWithFile, 'utf8');

  if (shellWithSource) {
    console.log(source);
  }

  var lexer = new _lexer.Lexer(source);
  var tokens = lexer.tokenizer();

  if (shellWithToken) {
    tokens.forEach(function (v, i) {
      return console.log(i, v);
    });
    console.log('----------------------------------------------');
  }

  var parser = new _parser.Parser(tokens);
  var ast = parser.parse();

  if (shellWithAst) {
    ast.body.forEach(function (v, i) {
      return console.log(i, v);
    });
    console.log('----------------------------------------------');
  }

  if (shellWithShowAll) {
    tokens.forEach(function (v, i) {
      return console.log(i, v);
    });
    console.log('----------------------------------------------');
    ast.body.forEach(function (v, i) {
      return console.log(i, v);
    });
    console.log('----------------------------------------------');
  }

  var interpreter = new _interpreter.Interpreter(ast, environment);
  interpreter.eval();

  if (shellWithEnv || shellWithShowAll) {
    console.log('----------------------------------------------');
    process.stdout.write('keys: ');
    console.log(Object.keys(_environment.envMap));
    process.stdout.write('values: ');
    console.log(Object.values(_environment.envMap));
  }

  process.exit();
}

var interpreterLine = function interpreterLine(line) {
  var lexer = new _lexer.Lexer(line);
  var tokens = lexer.tokenizer();
  var parser = new _parser.Parser(tokens);
  var ast = parser.parse();
  var interpreter = new _interpreter.Interpreter(ast, environment);
  interpreter.eval();
};