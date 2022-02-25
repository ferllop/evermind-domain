import {DomainErrorCode} from './DomainErrorCode.js'
import {DomainError} from './DomainError.js'

export class UndocumentedError extends DomainError {
    constructor(error: Error) {
        super(DomainErrorCode.UNDOCUMENTED, error.stack)
    }
}