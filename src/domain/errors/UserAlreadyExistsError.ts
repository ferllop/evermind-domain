import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class UserAlreadyExistsError extends DomainError {
    constructor() {
        super(DomainErrorCode.USER_ALREADY_EXISTS, 'User already exists')
    }
}