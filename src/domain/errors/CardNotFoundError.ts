import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class CardNotFoundError extends DomainError {
    constructor() {
        super(DomainErrorCode.CARD_NOT_FOUND, 'Card not exists')
    }
}