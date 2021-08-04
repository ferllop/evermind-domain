import { precondition } from '../../lib/preconditions.js'
import { uuid } from '../../lib/uuid.js'

export class Identification {
    private value: string

    constructor(value?: string) {
        precondition(value ? Identification.isValid(value) : true)
        this.value = value ?? uuid()
    }

    equals(idValue: string): boolean {
        return this.value === idValue
    }

    toString(): string {
        return this.value
    }

    static isValid(data: any): boolean {
        return typeof data === 'string' && data.length > 0
    }
}

