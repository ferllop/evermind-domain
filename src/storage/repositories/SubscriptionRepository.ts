import { DomainError } from '../../errors/DomainError.js';
import { ErrorType } from '../../errors/ErrorType.js';
import { Subscription } from '../../models/subscription/Subscription.js';
import { SubscriptionField } from '../../models/subscription/SubscriptionField.js';
import { SubscriptionMapper } from '../../models/subscription/SubscriptionMapper.js';
import { SubscriptionDto } from '../../models/subscription/SusbcriptionDto.js';
import { User } from '../../models/user/User.js';
import { Datastore } from '../datastores/Datastore.js';

export class SubscriptionRepository {

    constructor(private datastore: Datastore) { }

    add(subscription: Subscription): DomainError {
        if (this.has(subscription)) {
            return new DomainError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD)
        }
        const dto = new SubscriptionMapper().toDto(subscription)
        this.datastore.create(SubscriptionField.TABLE_NAME, dto)
        return DomainError.NULL
    }

    has(subscription: Subscription): boolean {
        return this.datastore.hasTable(SubscriptionField.TABLE_NAME) &&
            Boolean(this.datastore.read(SubscriptionField.TABLE_NAME, subscription.getId().getId()))
    }

    retrieve() {

    }

    update() {

    }

    delete(subscription: Subscription) {
        if (!this.has(subscription)) {
            return new DomainError(ErrorType.SUBSCRIPTION_NOT_EXISTS)
        }

        this.datastore.delete(SubscriptionField.TABLE_NAME, subscription.getId().getId())
        return DomainError.NULL
    }

    findByUserId(user: User) {
        const finder = (subscription: SubscriptionDto) => {
            return subscription.userId === user.getId().getId()
        }

        if (!this.datastore.hasTable(SubscriptionField.TABLE_NAME)) {
            return []
        }

        const subscriptions = this.datastore.find(SubscriptionField.TABLE_NAME, finder)
        
        return subscriptions.map( subscription => new SubscriptionMapper().fromDto(subscription))
    }

}
