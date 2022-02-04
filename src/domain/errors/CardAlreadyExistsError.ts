import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class CardAlreadyExistsError extends DomainError {
    constructor() {
        super(DomainErrorCode.CARD_ALREADY_EXISTS, 'Card already exists')
    }
}