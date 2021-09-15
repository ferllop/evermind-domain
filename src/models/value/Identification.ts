import { precondition } from '../../implementations/preconditions.js'
import { ImplementationsContainer } from '../../implementations/ImplementationsContainer.js'
import { UuidGenerator } from './UuidGenerator.js'

export class Identification {
    static NULL = new Identification('')

    private id: string

    constructor(value: string) {
        this.id = value
    }
    
    static create(): Identification {
        const idGenerator = ImplementationsContainer.get('uuid') as UuidGenerator
        return new Identification(idGenerator.getUuid())
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

