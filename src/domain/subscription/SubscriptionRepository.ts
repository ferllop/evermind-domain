import {Subscription} from './Subscription'
import {User} from '../user/User.js'
import {Identification} from '../shared/value/Identification'
import {SubscriptionDao} from './SubscriptionDao'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory'

export class SubscriptionRepository {

    private dao: SubscriptionDao

    constructor() {
        this.dao = PersistenceFactory.getSubscriptionDao()
    }

    async add(subscription: Subscription) {
        await this.dao.insert(subscription)
    }

    async update(entity: Subscription) {
        return await this.dao.update(entity)
    }

    async delete(subscription: Subscription) {
        await this.dao.delete(subscription.getId())

    }

    async findById(id: Identification): Promise<Subscription> {
        return await this.dao.findById(id)
    }

    async findByUserId(user: User) {
        return await this.dao.findByUserId(user.getId())
    }

}
