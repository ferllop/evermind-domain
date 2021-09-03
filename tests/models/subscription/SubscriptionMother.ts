import { Subscription } from '../../../src/models/subscription/Subscription.js';
import { SubscriptionMapper } from '../../../src/models/subscription/SubscriptionMapper.js';
import { SubscriptionBuilder } from './SubscriptionBuilder.js';

export class SubscriptionMother {
    TABLE_NAME = 'subscriptions'
    subscription: Subscription = new SubscriptionBuilder().build()
    userId = 'theuserid'
    cardId = 'thecardid'
    id = this.userId + '#' + this.cardId

    newDto() {
        return { cardId: 'thecardId', userId: 'theuserId' }
    }

    withId(id: string) {
        this.subscription = new SubscriptionBuilder().setId(id).build()
        return this
    }

    getDto() {
       return new SubscriptionMapper().toDto(this.subscription) 
    }
}
