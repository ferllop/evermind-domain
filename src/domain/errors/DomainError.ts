import { ErrorEnglish, ErrorType } from './ErrorType.js'

export class DomainError extends Error {
    static NULL = new DomainError(ErrorType.NULL)
    
    private readonly code: ErrorType

    constructor(errorType: ErrorType){
        super(ErrorEnglish.get(errorType) ?? DomainError.getUndocumentedErrorMessage(errorType))
        this.code = errorType
    }

    private static getUndocumentedErrorMessage(errorType: ErrorType) {
        return `Error with code ${errorType} not documented`
    }

    getCode() {
        return this.code
    }

}
