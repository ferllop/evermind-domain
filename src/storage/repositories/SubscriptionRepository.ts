import { DomainError } from '../../errors/DomainError.js';
import { ErrorType } from '../../errors/ErrorType.js';
import { Subscription } from '../../models/subscription/Subscription.js';
import { SubscriptionField } from '../../models/subscription/SubscriptionField.js';
import { SubscriptionMapper } from '../../models/subscription/SubscriptionMapper.js';
import { SubscriptionDto } from '../../models/subscription/SusbcriptionDto.js';
import { User } from '../../models/user/User.js';
import { Identification } from '../../models/value/Identification.js';
import { Datastore } from '../datastores/Datastore.js';
import { Repository } from './Repository.js';

export class SubscriptionRepository extends Repository<Subscription, SubscriptionDto> {

    constructor(datastore: Datastore) {
        super(SubscriptionField.TABLE_NAME, new SubscriptionMapper(), datastore)
    }

    store(subscription: Subscription): DomainError {
        if (this.has(subscription.getId())) {
            return new DomainError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD)
        }
        
        return super.store(subscription)
    }

    has(subscriptionId: Identification): boolean {
        return this.datastore.hasTable(SubscriptionField.TABLE_NAME) &&
            Boolean(this.datastore.read(SubscriptionField.TABLE_NAME, subscriptionId.getId()))
    }

    delete(id: Identification) {
        if (!this.has(id)) {
            return new DomainError(ErrorType.SUBSCRIPTION_NOT_EXISTS)
        }

        return super.delete(id)
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
