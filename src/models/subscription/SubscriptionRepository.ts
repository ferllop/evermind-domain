import { Subscription } from '../../models/subscription/Subscription.js';
import { SubscriptionField } from '../../models/subscription/SubscriptionField.js';
import { SubscriptionMapper } from '../../models/subscription/SubscriptionMapper.js';
import { SubscriptionDto } from '../../models/subscription/SusbcriptionDto.js';
import { User } from '../../models/user/User.js';
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
