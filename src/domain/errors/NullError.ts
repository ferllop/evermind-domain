import {DomainErrorCode} from './DomainErrorCode.js'
import {DomainError} from './DomainError.js'

export class NullError extends DomainError {
    constructor() {
        super(DomainErrorCode.NO_ERROR, 'No error')
    }
}