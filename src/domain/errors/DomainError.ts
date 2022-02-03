import { ErrorEnglish, ErrorType } from './ErrorType.js'
import {ErrorDto} from '../../use-cases/ErrorDto.js'

export class DomainError extends Error {
    static NULL = new DomainError(ErrorType.NULL)
    
    private readonly code: ErrorType

    constructor(errorType: ErrorType, error?: Error){
        super(ErrorEnglish.get(errorType) ?? DomainError.getUndocumentedErrorMessage(errorType))
        this.code = errorType
        if (error) {
           this.message = error.message
        }
    }

    private static getUndocumentedErrorMessage(errorType: ErrorType) {
        return `Error with code ${errorType} not documented`
    }

    getCode() {
        return this.code
    }

    toDto(): ErrorDto {
        return { code: this.code, message: this.message }
    }

}
