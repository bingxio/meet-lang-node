
import { Token } from "../token/token";

let WHITESPACE = /\s/;
let NUMBERS = /[0-9]/;
let LETTERS = /[a-z|A-Z]/;

export class Lexer {

    constructor(code) {
        this.code = code;
        this.tokens = [];
        this.current = 0;
    }

    tokenizer() {
        while (this.current < this.code.length) {
            let char = this.code[this.current];
    
            if (char == '#') {
                char = this.code[++ this.current];

                while (char != '#') {
                    char = this.code[++ this.current];

                    if (this.current == this.code.length) {
                        throw new SyntaxError('注释必须以 # 结束，并一一对应');
                    }
                }
    
                this.current ++;
    
                continue;
            }
    
            if (char == '(') {
                this.newToken('paren', '(');
    
                this.current ++;
                continue;
            }
    
            if (char == ')') {
                this.newToken('paren', ')');
    
                this.current ++;
                continue;
            }
    
            if (char == '\'') {
                let value = '';
    
                char = this.code[++ this.current];
    
                while (char != '\'') {
                    value += char;
                    char = this.code[++ this.current];

                    if (this.current == this.code.length) {
                        throw new SyntaxError('字符串必须一一对应');
                    }
                }
    
                this.newToken('string', value);
    
                this.current ++;
                continue;
            }
    
            /////////////////////////////////////////////
    
            if (char == '=' && this.code[++ this.current] == '>') {
                this.newToken('operator', '=>');
                
                this.current ++;
                continue;
            }

            if ((char == '+' || char == '*' || char == '/' || char == '>' || 
                 char == '<' || char == '!' || char == '=') && this.code[++ this.current] == '=') {
                this.newToken('operator', char += '=');

                this.current ++;
                continue;
            }

            if (char == '-') {
                this.current ++;

                if (this.code[this.current] == '>') {
                    this.newToken('operator', '->');

                    this.current ++;
                    continue;
                }

                if (this.code[this.current] == '=') {
                    this.newToken('operator', '-=');

                    this.current ++;
                    continue;
                }

                this.newToken('operator', '-');

                this.current ++;
                continue;
            }
    
            /////////////////////////////////////////////
    
            if (char == '+' || char == '-' || char == '*' || char == '/' ||
                char == ';' || char == ',' || char == '>' || char == '<' ||
                char == '{' || char == '}' || char == '=' || char == '%' ||
                char == '[' || char == ']') {
                this.newToken('operator', char);
    
                this.current ++;
                continue;
            }
    
            if (WHITESPACE.test(char)) {
                this.current ++;
                continue;
            }
    
            if (NUMBERS.test(char)) {
                let value = '';
    
                while (NUMBERS.test(char)) {
                    value += char;
                    char = this.code[++ this.current];
                }
    
                this.newToken('number', value);
    
                continue;
            }
            
            if (LETTERS.test(char)) {
                let value = '';
    
                while (LETTERS.test(char) && typeof(char) != 'undefined') {
                    value += char;
                    char = this.code[++ this.current];
                }

                if (this.code[this.current] == '[') {
                    let listValue = '';

                    while (this.code[this.current] != ']') {
                        listValue += char;
                        char = this.code[++ this.current];

                        if (this.current == this.code.length) {
                            throw new SyntaxError('列表括号必须一一对应');
                        }
                    }

                    listValue += ']';
                    value += listValue;

                    this.current ++; // skip ']';
                    this.newToken('list', value);

                    continue;
                }
    
                this.newToken('name', value);
    
                continue;
            }
    
            throw new TypeError('我不知道这个字符是什么：' + char);
        }

        this.newToken('EOF', 'EOF');
        
        return this.tokens;
    }

    newToken(t, v) {
        let token = new Token(t, v);

        this.tokens.push(token);
    }
}