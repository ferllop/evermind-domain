import {User} from './User.js'
import {UserDao} from './UserDao.js'
import {UserIdentification} from './UserIdentification.js'
import {Username} from './Username.js'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory.js'
import {UserPermissions} from '../authorization/permission/UserPermissions.js'
import {UserPermissionsAuthorization} from '../authorization/permission/UserPermissionsAuthorization.js'
import {RemoveUserAccount} from '../authorization/permission/permissions/RemoveUserAccount.js'
import {GetDataFromOtherUser} from '../authorization/permission/permissions/GetDataFromOtherUser.js'

export class UserRepository {

    dao: UserDao

    constructor() {
        this.dao = PersistenceFactory.getUserDao()
    }

    async add(user: User) {
        await this.dao.insert(user)
    }

    async delete(user: User, permissions: UserPermissions) {
        UserPermissionsAuthorization.userWithPermissions(permissions).assertCan(RemoveUserAccount, user)
        await this.dao.delete(user.getId())
    }

    async findById(userId: UserIdentification) {
        return await this.dao.findById(userId)
    }

    async getById(userId: UserIdentification, permissions: UserPermissions) {
        UserPermissionsAuthorization.userWithPermissions(permissions).assertCan(GetDataFromOtherUser, userId)
        return await this.dao.findById(userId)
    }

    async findByUsername(username: Username) {
        return await this.dao.findByUsername(username)
    }

    async update(user: User) {
        await this.dao.update(user)
    }

}
