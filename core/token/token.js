
export class Token {

    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    toString() {
        return `Token { type: ${this.type}, value: ${this.value} }`;
    }
}