import { Subscription } from '../subscription/Subscription.js';
import { SubscriptionField } from '../subscription/SubscriptionField.js';
import { SubscriptionMapper } from '../subscription/SubscriptionMapper.js';
import { SubscriptionDto } from '../subscription/SusbcriptionDto.js';
import { User } from '../user/User.js';
import { Repository } from '../Repository.js';
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
