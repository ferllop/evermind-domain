import {Subscription} from './Subscription'
import {SubscriptionIdentification} from './SubscriptionIdentification'
import {UserIdentification} from '../user/UserIdentification'

export interface SubscriptionDao {
    insert(entity: Subscription): Promise<void>

    delete(id: SubscriptionIdentification): Promise<void>

    findById(id: SubscriptionIdentification): Promise<Subscription>

    update(entity: Subscription): Promise<void>

    findByUserId(id: UserIdentification): Promise<Subscription[]>
}