import {Subscription} from '../../../src/domain/subscription/Subscription.js'
import {SubscriptionBuilder} from './SubscriptionBuilder.js'

export class SubscriptionMother {
    TABLE_NAME = 'subscriptions'
    subscription: Subscription = new SubscriptionBuilder().build()
    userId = 'the-user-id'
    cardId = 'the-card-id'
    id = this.subscription.getId().getId()

    newDto() {
        return { cardId: 'the-card-Id', userId: 'the-user-Id' }
    }

    withId(id: string) {
        this.subscription = new SubscriptionBuilder().setId(id).build()
        return this
    }

    getDto() {
       return this.subscription.toDto()
    }
}
