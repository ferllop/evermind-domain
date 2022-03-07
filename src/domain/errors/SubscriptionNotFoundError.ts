import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class SubscriptionNotFoundError extends DomainError {
    constructor() {
        super(DomainErrorCode.SUBSCRIPTION_NOT_FOUND, 'Subscription not exists')
    }
}