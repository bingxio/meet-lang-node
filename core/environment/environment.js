
export let envMap = {};

export class Environment {

    get(k) {
        if (envMap.hasOwnProperty(k)) {
            return envMap[k];
        } else {
            return undefined;
        }
    }

    set(k, v) {
        envMap[k] = v;
    }

    has(k) {
        return envMap.hasOwnProperty(k);
    }
}