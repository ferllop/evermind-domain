import {User} from './User.js'
import {UserDao} from './UserDao.js'
import {UserIdentification} from './UserIdentification.js'
import {Username} from './Username.js'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory.js'
import {UserPermissions} from '../authorization/permission/UserPermissions.js'
import {UserAuthorization} from '../authorization/permission/UserAuthorization.js'
import {RemoveUserAccount} from '../authorization/permission/permissions/RemoveUserAccount.js'
import {GetDataFromOtherUser} from '../authorization/permission/permissions/GetDataFromOtherUser.js'
import {StoredUser} from './StoredUser.js'
import {UserAlreadyExistsError} from '../errors/UserAlreadyExistsError.js'

export class UserRepository {

    dao: UserDao

    constructor() {
        this.dao = PersistenceFactory.getUserDao()
    }

    async add(user: User) {
        if (await this.hasUsername(user.getUsername())) {
            throw new UserAlreadyExistsError()
        }
        return await this.dao.insert(user)
    }

    async delete(user: StoredUser, permissions: UserPermissions) {
        UserAuthorization.userWithPermissions(permissions).assertCan(RemoveUserAccount, user)
        await this.dao.delete(user)
    }

    async findById(userId: UserIdentification) {
        return await this.dao.findById(userId)
    }

    async getById(userId: UserIdentification, permissions: UserPermissions) {
        UserAuthorization.userWithPermissions(permissions).assertCan(GetDataFromOtherUser, userId)
        return await this.dao.findById(userId)
    }

    async findByUsername(username: Username) {
        return await this.dao.findByUsername(username)
    }

    async update(user: StoredUser) {
        await this.dao.update(user)
    }

    private async hasUsername(username: Username) {
        const user = await this.dao.findByUsername(username)
        return ! user.isNull()
    }

}
