export class Username {
    static NULL = new Username('')
    private readonly value: string

    constructor(value: string) {
        this.value = value.toLowerCase()
    }

    getValue() {
        return this.value
    }

    toString() {
        return this.getValue()
    }

    static isValid(name: string) {
        return name.length > 0
    }

}
