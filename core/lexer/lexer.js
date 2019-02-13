
import { Token } from "../token/token";

let current = 0;

let tokens = [];

let WHITESPACE = /\s/;
let NUMBERS = /[0-9]/;
let LETTERS = /[a-z|A-Z]/i;

export let tokenizer = code => {

    while (current < code.length) {
        let char = code[current];

        if (char == '#') {
            char = code[++ current];

            while (char != '#') {
                char = code[++ current];

                if (current == code.length) {
                    throw new SyntaxError('注释必须以 # 结束，并一一对应');
                }
            }

            current ++;

            continue;
        }

        if (char == '(') {
            newToken('paren', '(');

            current ++;
            continue;
        }

        if (char == ')') {
            newToken('paren', ')');

            current ++;
            continue;
        }

        if (char == '"') {
            let value = '';

            char = code[++ current];

            while (char != '"') {
                value += char;
                char = code[++ current];
            }

            newToken('string', value);

            current ++;
            continue;
        }

        /////////////////////////////////////////////

        if (char == '-' && code[++ current] == '>') {
            newToken('operator', '->');            

            current ++;
            continue;
        }

        if (char == '>' && code[++ current] == '=') {
            newToken('operator', '>=')

            current ++;
            continue;
        }

        if (char == '<' && code[++ current] == '=') {
            newToken('operator', '<=')

            current ++;
            continue;
        }

        if (char == '!' && code[++ current] == '=') {
            newToken('operator', '!=')

            current ++;
            continue;
        }

        if (char == '=' && code[++ current] == '=') {
            newToken('operator', '==')

            current ++;
            continue;
        }

        /////////////////////////////////////////////

        if (char == '+' || char == '-' || char == '*' || char == '/' ||
            char == ';' || char == ',' || char == '>' || char == '<' ||
            char == '{' || char == '}' || char == '=') {
            newToken('operator', char); 

            current ++;
            continue;
        }

        if (WHITESPACE.test(char)) {
            current ++;
            continue;
        }

        if (NUMBERS.test(char)) {
            let value = '';

            while (NUMBERS.test(char)) {
                value += char;
                char = code[++ current];
            }

            newToken('number', value);

            continue;
        }
        
        if (LETTERS.test(char)) {
            let value = '';

            while (LETTERS.test(char) && typeof(char) != 'undefined') {
                value += char;
                char = code[++ current];
            }

            newToken('name', value);

            continue;
        }

        throw new TypeError('我不知道这个字符是什么：' + char);
    }

    newToken('EOF', 'EOF');

    return tokens;
};

export let newToken = (type, value) => {
    let token = new Token(type, value);

    tokens.push(token);
};