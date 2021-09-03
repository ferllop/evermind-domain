export class Username {
    constructor(private value: string) {}

    getValue() {
        return this.value
    }

    toString() {
        return this.getValue()
    }

    static isValid(name: string) {
        return typeof name === 'string' && name.length > 0
    }

}
