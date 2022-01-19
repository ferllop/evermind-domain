import {SubscriptionDao} from '../../../domain/subscription/SubscriptionDao'
import {Subscription} from '../../../domain/subscription/Subscription'

export class SubscriptionNullDao implements SubscriptionDao {
    delete(): Promise<void> {
        throw new Error('Method not implemented')
    }

    findById(): Promise<Subscription> {
        throw new Error('Method not implemented')
    }

    findByUserId(): Promise<Subscription[]> {
        return Promise.resolve([])
    }

    insert(): Promise<void> {
        throw new Error('Method not implemented')
    }

    update(): Promise<void> {
        throw new Error('Method not implemented')
    }

}