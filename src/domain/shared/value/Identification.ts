import {NodeNativeUuid} from '../NodeNativeUuidGenerator.js'
import {InputDataNotValidError} from '../../errors/InputDataNotValidError.js'

export class Identification {
    static NULL = new Identification('')

    private readonly id: string

    constructor(value: string) {
        this.id = value
    }
    
    static create(): Identification {
        const idGenerator = new NodeNativeUuid()
        return new Identification(idGenerator.getUuid())
    }
    
    static recreate(value: string) {
        if (!Identification.isValid(value)) {
            throw new InputDataNotValidError()
        }
        return new Identification(value)
    }

    clone() {
        return Identification.recreate(this.getId())
    }

    equals(identification: Identification): boolean {
        return this.getId() === identification.getId()
    }

    getId(): string {
        return this.id
    }

    isNull() {
        return this.id.length === 0
    }
    
    static isValid(data: any): boolean {
        return typeof data === 'string' && data.length > 0
    }
}
