import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class ResourceNotFoundError extends DomainError {
    constructor() {
        super(DomainErrorCode.RESOURCE_NOT_FOUND, 'Resource not found')
    }
}