
import { Lexer } from './lexer/lexer';
import { Parser } from './parser/parser';
import { Interpreter } from './ast/interpreter';
import { Environment } from './environment/environment';

import fs from 'fs';
import path from 'path';
import readline from 'readline';

let shellWithFile = undefined;
let shellWithToken = false;
let shellWithShowAll = false;
let shellWithAst = false;
let shellWithSource = false;

let r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * 公用存储变量表
 */
let environment = new Environment();

if (process.argv.length == 2) {
    process.stdout.write('Meet Programming Language REPL - Turaiiao 2019 - Email: 1171840237@qq.com \n> ');

    r1.on('line', (input) => {
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
    
    let lexer = new Lexer(source);
    let tokens = lexer.tokenizer();
    
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

    let interpreter = new Interpreter(ast, environment);
    
    interpreter.eval();

    process.exit();
}

let interpreterLine = line => {
    let lexer = new Lexer(line);
    let tokens = lexer.tokenizer();
    let parser = new Parser(tokens);
    let ast = parser.parse();

    let interpreter = new Interpreter(ast, environment);

    interpreter.eval();
};
