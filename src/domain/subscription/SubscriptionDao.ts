import {Subscription} from './Subscription'
import {Identification} from '../shared/value/Identification'
import {User} from '../user/User'

export interface SubscriptionDao {
    insert(entity: Subscription): Promise<void>

    delete(entity: Subscription): Promise<void>

    findById(id: Identification): Promise<Subscription>

    update(entity: Subscription): Promise<void>

    findByUserId(user: User): any
}