export class PersonName {
    static NULL = new PersonName('')

    constructor(private value: string) {}

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
