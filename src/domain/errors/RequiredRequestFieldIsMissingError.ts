import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class RequiredRequestFieldIsMissingError extends DomainError {
    constructor() {
        super(DomainErrorCode.REQUIRED_REQUEST_FIELD_IS_MISSING, 'Required request field is missing')
    }
}