
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
> fuck b -> "Hello World";
> print -> a;
20
> print -> b;
Hello World
>
```

The third way, you can run the specified file.  
Of course, you can also add parameters like `-token` or `-ast` or `-all` to show token or ast syntax trees.

```
node dist/meet.js sample.meet
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
fuck b -> "Hello World";
```

It defines variables to variable tables.

### Print to screen

```
print -> 666;               # print but no line feed #
printLine -> 888;           # print and line feed #
printLine;                  # individual print line feed #
printLine -> "Hello World";

Output:
666888

Hello World
```

### Conditional statement

```
fuck a -> 20;
fuck b -> 50;

if a == b {
    printLine -> "Equal";
}

if a > b {
    printLine -> "max is a";
} else {
    printLine -> "max is b";
}

Output:
Equal
max is b
```

### Loop statement
```
fuck condition -> 0;

while condition < 10 {
    plus -> condition;      # plus one #

    if condition == 5 {
        printLine -> "Equal 5";
    } else {
        printLine -> condition;
    }
}

Output:
1
2
3
4
Equal 5
6
7
8
9
10
```

### Magic Identifier

```
fuck a -> 0;

minus -> a;
minus -> a;

printLine -> a;

plus -> a;
plus -> a;
plus -> a;
plus -> a;

printLine -> a;

Output:
-2
2
```