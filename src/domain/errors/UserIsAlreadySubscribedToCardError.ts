import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class UserIsAlreadySubscribedToCardError extends DomainError {
    constructor() {
        super(DomainErrorCode.USER_IS_ALREADY_SUBSCRIBED_TO_CARD, 'User is already subscribed to card')
    }
}