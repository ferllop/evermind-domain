import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class UserNotFoundError extends DomainError {
    constructor() {
        super(DomainErrorCode.USER_NOT_FOUND, 'User not exists')
    }
}