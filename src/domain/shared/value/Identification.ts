import {NodeNativeUuid} from '../NodeNativeUuidGenerator.js'
import {InputDataNotValidError} from '../../errors/InputDataNotValidError.js'

export class Identification {
    static NULL = new Identification('')

    constructor(private readonly value: string) {
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
        return Identification.recreate(this.getValue())
    }

    equals(identification: Identification): boolean {
        return this.getValue() === identification.getValue()
    }

    getValue(): string {
        return this.value
    }

    isNull() {
        return this.value.length === 0
    }
    
    static isValid(data: any): boolean {
        return typeof data === 'string' && data.length > 0
    }
}
