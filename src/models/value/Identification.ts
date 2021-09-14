import { precondition } from '../../lib/preconditions.js'
import { uuid } from '../../lib/uuid.js'

export class Identification {
    static NULL = new Identification('')

    private id: string

    constructor(value: string) {
        this.id = value
    }
    
    static create(): Identification {
        return new Identification(uuid())
    }
    
    static recreate(value: string) {
        precondition(Identification.isValid(value))
        return new Identification(value)
    }


    equals(identification: Identification): boolean {
        return this.id === identification.id
    }

    equalsString(identification: string) {
        return this.equals(new Identification(identification))
    }

    getId(): string {
        return this.id
    }

    merge<T extends Identification>(identification: Identification, separator = ''): T {
        return Identification.recreate(this.getId() + separator + identification.getId()) as T
    }

    isNull() {
        return this.id.length === 0
    }
    
    static isValid(data: any): boolean {
        return typeof data === 'string' && data.length > 0
    }
}

