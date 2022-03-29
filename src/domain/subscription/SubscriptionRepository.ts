import {Subscription} from './Subscription.js'
import {User} from '../user/User.js'
import {Identification} from '../shared/value/Identification.js'
import {SubscriptionDao} from './SubscriptionDao.js'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory.js'
import {UserAuthorization} from '../authorization/permission/UserAuthorization.js'
import {UserPermissions} from '../authorization/permission/UserPermissions.js'
import {ReadSubscriptions} from '../authorization/permission/permissions/ReadSubscriptions.js'

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

    async getByUserId(user: User, permissions: UserPermissions) {
        UserAuthorization.userWithPermissions(permissions).assertCan(ReadSubscriptions, user)
        return await this.dao.findByUserId(user.getId())
    }

}
