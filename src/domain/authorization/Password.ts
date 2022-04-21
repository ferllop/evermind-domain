export class Password {
    constructor(private value: string){}

    getValue() {
        return this.value
    }

    static isValid(value: string): boolean {
        const regex = /[-_.a-z0-9]*/i
        return regex.test(value)
    }

}
