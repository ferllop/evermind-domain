import {Subscription} from './Subscription'
import {SubscriptionIdentification} from './SubscriptionIdentification'
import {UserIdentification} from '../user/UserIdentification'

export interface SubscriptionDao {
    insert(subscription: Subscription): Promise<void>

    update(subscription: Subscription): Promise<void>

    delete(id: SubscriptionIdentification): Promise<void>

    findById(id: SubscriptionIdentification): Promise<Subscription>

    findByUserId(id: UserIdentification): Promise<Subscription[]>
}