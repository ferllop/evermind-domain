import { ErrorType } from './ErrorType.js'

export class DomainError extends Error {
    static NULL = new DomainError(ErrorType.NULL)
    
    private type: ErrorType

    constructor(errorType: ErrorType){
        super()
        this.type = errorType
    }

    getType() {
        return this.type
    }

}
