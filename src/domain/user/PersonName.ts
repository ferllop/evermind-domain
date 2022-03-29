import {InputDataNotValidError} from '../errors/InputDataNotValidError.js'

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

    static create(name: string) {
        if(!this.isValid(name)){
            throw new InputDataNotValidError()
        }
        return new PersonName(name)
    }
}
