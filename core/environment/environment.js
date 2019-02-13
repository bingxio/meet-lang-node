
let variableMap = {};

export class Environment {

    get(k) {
        if (variableMap.hasOwnProperty(k)) {
            return variableMap[k];
        } else {
            return undefined;
        }
    }

    set(k, v) {
        variableMap[k] = v;
    }

    has(k) {
        return variableMap.hasOwnProperty(k);
    }
}