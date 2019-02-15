
export class BinaryExpressionStatement {

    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    toString() {
        return `${this.left} ${this.operator} ${this.right}`;
    }
}

export class FuckStatement {

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    toString() {
        return `fuck ${this.name} -> ${this.value};`;
    }
}

export class PrintStatement {

    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    toString() {
        return `print -> ${this.name};`;
    }
}

export class PrintLineStatement {

    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    toString() {
        return `printLine -> ${this.name};`;
    }
}

export class ForEachStatement {

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `forEach -> ${this.name};`;
    }
}

export class MinusStatement {

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `minus -> ${this.name};`;
    }
}

export class PlusStatement {

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `plus -> ${this.name};`;
    }
}

export class IfStatement {

    constructor(condition, establish, contrary) {
        this.condition = condition;
        this.establish = establish;
        this.contrary = contrary;
    }

    toString() {
        if (contrary != undefined) {
            return `if ${this.condition} {
                ${this.establish}
            } else {
                ${this.contrary}
            }`;
        } else {
            return `if ${this.condition} {
                ${this.establish}
            }`;
        }
    }

}

export class WhileStatement {

    constructor(condition, establish) {
        this.condition = condition;
        this.establish = establish;
    }

    toString() {
        return `while ${this.condition} {
            ${this.establish}
        }`;s
    }
}

export class ListStatement {

    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    toString() {
        return `${this.type} list[${this.value}];`;
    }
}

export class ForStatement {

    constructor(establish) {
        this.establish = establish;
    }

    toString() {
        return `for {
            ${this.establish}
        }`;
    }
}

export class BreakStatement {

    constructor() {
        this.name = 'break';
    }

    toString() {
        return `${this.name};`;
    }
}

export class DefineFunStatement {

    constructor(name, establish) {
        this.name = name;
        this.establish = establish;
    }

    toString() {
        return `fun ${this.name} => {
            ${this.establish}
        }`;
    }
}

export class CallFunStatement {

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `fun -> ${this.name}`;
    }
}

export class SetStatement {

    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    toString() {
        return `set ${this.name} -> ${this.value}`;
    }
}
