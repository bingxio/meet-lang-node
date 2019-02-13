
import { tokenizer } from './lexer/lexer';
import { Parser } from './parser/parser';
import { Interpreter } from './ast/interpreter';
import { Environment } from './environment/environment';

import fs from 'fs';
import path from 'path';

let shellWithFile = undefined;
let shellWithToken = false;
let shellWithShowAll = false;
let shellWithAst = false;
let shellWithSource = false;

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

let extname = path.extname(shellWithFile);

if (extname != '.meet') {
    throw new Error(`未知的文件后缀：${extname}，仅限 '.meet'`);
}

let source = fs.readFileSync(shellWithFile, 'utf8');

if (shellWithSource) {
    console.log(source);
}

let tokens = tokenizer(source);

if (shellWithToken) {
    tokens.forEach((v, i) => console.log(i, v));
    console.log('----------------------------------------------');
}

let parser = new Parser(tokens);
let ast = parser.parse();

if (shellWithAst) {
    ast.body.forEach((v, i) => console.log(i, v));
    console.log('----------------------------------------------');
}

if (shellWithShowAll) {
    tokens.forEach((v, i) => console.log(i, v));
    console.log('----------------------------------------------');
    ast.body.forEach((v, i) => console.log(i, v));
    console.log('----------------------------------------------');
}

let environment = new Environment();
let interpreter = new Interpreter(ast, environment);

interpreter.eval();
