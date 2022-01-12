import { Subscription } from './Subscription';
import { SubscriptionField } from './SubscriptionField';
import { SubscriptionMapper } from './SubscriptionMapper';
import { SubscriptionDto } from './SusbcriptionDto';
import { User } from '../user/User.js';
import { Repository } from '../shared/Repository.js';
import { NullSubscription } from './NullSubscription.js';

export class SubscriptionRepository extends Repository<Subscription, SubscriptionDto> {

    constructor() {
        super(SubscriptionField.TABLE_NAME, new SubscriptionMapper())
    }

    async findByUserId(user: User) {
        const criteria = (subscription: SubscriptionDto) => {
            return subscription.userId === user.getId().getId()
        }
        return this.find(criteria)
    }

    getNull() {
        return NullSubscription.getInstance()
    }
}
