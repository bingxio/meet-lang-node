"use strict";

var _lexer = require("./lexer/lexer");

var _parser = require("./parser/parser");

var _interpreter = require("./ast/interpreter");

var _environment = require("./environment/environment");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shellWithFile = undefined;
var shellWithToken = false;
var shellWithShowAll = false;
var shellWithAst = false;
var shellWithSource = false;

if (process.argv[2] == '-token') {
  shellWithToken = true;
} else if (process.argv[2] == '-ast') {
  shellWithAst = true;
} else if (process.argv[2] == '-all') {
  shellWithShowAll = true;
} else if (process.argv[2] == '-source') {
  shellWithSource = true;
} else {
  shellWithFile = process.argv[2];
}

if (shellWithToken || shellWithAst || shellWithShowAll || shellWithSource) {
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

var tokens = (0, _lexer.tokenizer)(source);

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

var environment = new _environment.Environment();
var interpreter = new _interpreter.Interpreter(ast, environment);
interpreter.eval();