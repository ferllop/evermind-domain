import { precondition } from '../../lib/preconditions.js'
import { uuid } from '../../lib/uuid.js'

export class Identification {
    private id: string

    constructor(value: string) {
        precondition(Identification.isValid(value))
        this.id = value
    }

    static create(): Identification {
        return new Identification(uuid())
    }

    equals(identification: Identification): boolean {
        return this.id === identification.id
    }

    getId(): string {
        return this.id
    }

    merge(identification: Identification) {
        const SEPARATOR = '#'
        return new Identification(this.getId() + SEPARATOR + identification.getId())
    }
    
    static isValid(data: any): boolean {
        return typeof data === 'string' && data.length > 0
    }
}

