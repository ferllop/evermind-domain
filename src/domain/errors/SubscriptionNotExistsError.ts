import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class SubscriptionNotExistsError extends DomainError {
    constructor() {
        super(DomainErrorCode.SUBSCRIPTION_NOT_EXISTS, 'Subscription not exists')
    }
}