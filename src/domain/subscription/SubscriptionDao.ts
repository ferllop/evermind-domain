import {Subscription} from './Subscription.js'
import {SubscriptionIdentification} from './SubscriptionIdentification.js'
import {UserIdentification} from '../user/UserIdentification.js'

export interface SubscriptionDao {
    insert(subscription: Subscription): Promise<void>

    update(subscription: Subscription): Promise<void>

    delete(id: SubscriptionIdentification): Promise<void>

    findById(id: SubscriptionIdentification): Promise<Subscription>

    findByUserId(id: UserIdentification): Promise<Subscription[]>
}