import { Subscription } from '../../models/subscription/Subscription.js';
import { SubscriptionField } from '../../models/subscription/SubscriptionField.js';
import { SubscriptionMapper } from '../../models/subscription/SubscriptionMapper.js';
import { SubscriptionDto } from '../../models/subscription/SusbcriptionDto.js';
import { User } from '../../models/user/User.js';
import { Datastore } from '../Datastore.js';
import { Repository } from '../Repository.js';
import { NullSubscription } from './NullSubscription.js';

export class SubscriptionRepository extends Repository<Subscription, SubscriptionDto> {

    constructor(datastore: Datastore) {
        super(SubscriptionField.TABLE_NAME, new SubscriptionMapper(), datastore)
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

    getNull() {
        return NullSubscription.getInstance()
    }
}
