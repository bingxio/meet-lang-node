
<div align='center'>
    <img src='art.png'/>
</div>

## Meet Programming Language

This is a interpreter, it took me two days to write this project, just for fun ! 

Writing in JavaScript, you should use `babel` to build it to es5, then run it.

### Run

The first way, you can download it locally from `NPM`.

```
# install
npm i -g meet-lang

# then, you can open the command window anywhere and run the `meet` command to enter REPL interface
> meet

# run the specified code file
> meet sample.meet

> meet -token sample.meet   # run and show code tokens.
> meet -ast sample.meet     # run and show code ast tree.
> meet -all sample.meet     # run and show tokens and ast tree.
```

The second way, it will show the REPL interface.

```
node dist/meet.js
```

REPL:

```
Meet Programming Language REPL - Turaiiao 2019 - Email: 1171840237@qq.com
> fuck a -> 20;
> fuck b -> 'Hello World';
> fuck c -> (2 - 10);
> printLine -> a;
20
> printLine -> b;
Hello World
> printLine -> c;
-8
> 
```

The third way, you can run the specified file.  
Of course, you can also add parameters like `-token` or `-ast` or `-all` to show token or ast syntax trees.

```
node dist/meet.js [-token / -ast / -all] sample.meet
```

### Comment

Use `#`, must one-to-one correspondence.

```
fuck a -> 20;
# fuck b -> 50; # # Not execute #
```

### Fuck Identifier

```
fuck a -> 20;
fuck b -> 'Hello World';
fuck c -> (20 + 20);        # with expression #
```

It defines variables to variable tables.

### Print to screen

```
print -> 666;                       # print but no line feed #
printLine -> 888;                   # print and line feed #
printLine;                          # individual print line feed #
printLine -> 'Hello World';

Output:
666888

Hello World
```

### List

lists must be of the same type, it can now be integers and strings.  
use `forEach` identifier to print all element.

```
fuck name -> ['meet' 'programming' 'language' '!'];

fuck list -> [2 4 6 8 10];
fuck listPlus -> (list[3] + list[4]);

forEach -> list;    # meet programming language ! #
forEach -> name;    # 2 4 6 8 10 #

printLine -> list[4];   # 10 #
printLine -> listPlus;  # 18 #

Output:
2 4 6 8 10 
meet programming language ! 
10
18
```

### Conditional statement

```
fuck a -> 20;
fuck b -> 50;

if a == b {
    printLine -> 'Equal';
}

if a > b {
    print -> 'max is a, ';
} else {
    print -> 'max is b, ';
}

if (a += 30) == b {
    printLine -> 'oh, plus 30 to equal b.';
}

Output:
max is b, oh, plus 30 to equal b.
```

### Loop statement
```
fuck tom -> 0;
fuck frank -> 50;

while (tom += 1) < frank {
    if (tom % 2) == 0 {
        printLine -> tom;
    }
}

Output:
2
4
6
8
10
12
14
16
18
20
22
24
26
28
30
32
34
36
38
40
42
44
46
48
```

### Magic Identifier

```
fuck a -> 0;
fuck b -> [1 2 3 4 5];

minus -> a;
minus -> a;

printLine -> a;

plus -> a;
plus -> a;
plus -> a;
plus -> a;

printLine -> a;

forEach -> b;

Output:
-2
2
1 2 3 4 5
```

Just For Fun !

```
MIT License

Copyright (c) 2019 Xyiio Turaiiao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```