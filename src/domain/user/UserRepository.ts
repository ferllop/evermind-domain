import {User} from './User.js'
import {UserInMemoryDao} from '../../implementations/persistence/in-memory/UserInMemoryDao'
import {UserDao} from './UserDao'
import {UserIdentification} from './UserIdentification'
import {Username} from './Username'

export class UserRepository {

    dao: UserDao

    constructor() {
        this.dao = new UserInMemoryDao()
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
