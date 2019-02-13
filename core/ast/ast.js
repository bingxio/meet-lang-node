
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
        return `fuck ${this.name} -> ${this.value}`;
    }
}

export class PrintStatement {

    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    toString() {
        return `print -> ${this.name}`;
    }
}

export class PrintLineStatement {

    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

    toString() {
        return `printLine -> ${this.name}`;
    }
}

export class MinusStatement {

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `minus -> ${this.name}`;
    }
}

export class PlusStatement {

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `plus -> ${this.name}`;
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
        }`;
    }
}