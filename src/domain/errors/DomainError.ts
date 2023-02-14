import {DomainErrorCode} from './DomainErrorCode.js'
import {ErrorDto} from '../../types/dtos/ErrorDto.js'

export abstract class DomainError extends Error {

    private readonly code: DomainErrorCode

    protected constructor(errorType: DomainErrorCode, message?: string){
        super(message)
        this.code = errorType
    }

    getCode() {
        return this.code
    }

    toDto(): ErrorDto {
        return { code: this.code, message: this.message }
    }

}
