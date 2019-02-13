#### meet-lang

a simple interpreter write in nodeJS

一个小的解释器、

#### Run
```
node ./dist/meet.js
```

语法如下：

```javascript
import { tokenizer } from './lexer/lexer';
import { parser } from './parser/parser';
import { evaluate } from './ast/evaluate';

let codeSimple = `
    fuck a -> 200               # 测试赋值语句 #
    fuck b -> 520               # 测试赋值语句 #
    # print -> a #              # 测试注释语句 #
    print -> a                  # 测试输出语句 #
    printLine                   # 测试输出换行语句 #
    printLine -> a              # 测试输出换行语句 #
    printLine -> b              # 测试输出换行语句 #
    printLine -> a + b          # 测试输出表达式 #
    printLine -> 400 + 200      # 测试直接输出表达式 #
    printLine -> 400 - 200      # 测试直接输出表达式 #
    printLine -> 400 * 200      # 测试直接输出表达式 #
    printLine -> 400 / 200      # 测试直接输出表达式 #
`;

let tokenList = tokenizer(codeSimple); console.log(tokenList);
let astList = parser(tokenList); console.log(astList);
let evalBool = evaluate(astList); console.log(evalBool);
```
