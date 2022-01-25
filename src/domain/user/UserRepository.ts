import {User} from './User.js'
import {UserDao} from './UserDao.js'
import {UserIdentification} from './UserIdentification.js'
import {Username} from './Username.js'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory.js'

export class UserRepository {

    dao: UserDao

    constructor() {
        this.dao = PersistenceFactory.getUserDao()
    }

    async add(user: User) {
        await this.dao.insert(user)
    }

    async delete(user: User) {
        await this.dao.delete(user.getId())
    }

    async findById(id: UserIdentification) {
        return await this.dao.findById(id)
    }
    async findByUsername(username: Username) {
        return await this.dao.findByUsername(username)
    }

    async update(user: User) {
        await this.dao.update(user)
    }

}
