import { ErrorEnglish, ErrorType } from './ErrorType.js'

export class DomainError extends Error {
    static NULL = new DomainError(ErrorType.NULL)
    
    private code: ErrorType

    constructor(errorType: ErrorType){
        super(ErrorEnglish.get(errorType))
        this.code = errorType

    }

    getCode() {
        return this.code
    }

}
