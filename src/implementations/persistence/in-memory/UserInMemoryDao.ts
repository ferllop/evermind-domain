import {UserDao} from '../../../domain/user/UserDao.js'
import {InMemoryDatastore} from './InMemoryDatastore.js'
import {UserIdentification} from '../../../domain/user/UserIdentification.js'
import {UserDto} from '../../../domain/user/UserDto.js'
import {UserFactory} from '../../../domain/user/UserFactory.js'
import {User} from '../../../domain/user/User.js'
import {NullUser} from '../../../domain/user/NullUser.js'
import {Username} from '../../../domain/user/Username.js'
import {UserNotFoundError} from '../../../domain/errors/UserNotFoundError.js'
import {DataFromStorageNotValidError} from '../../../domain/errors/DataFromStorageNotValidError.js'
import {Email} from '../../../domain/user/Email.js'

export class UserInMemoryDao implements UserDao {

    protected readonly tableName = 'users'
    protected userFactory = new UserFactory()
    protected datastore: InMemoryDatastore

    constructor() {
        this.datastore = new InMemoryDatastore()
    }

    async insert(user: User) {
        const result = await this.datastore.create(this.tableName, user.toDto())
        if (!result) {
            throw new DataFromStorageNotValidError()
        }
    }

    async findById(id: UserIdentification): Promise<User> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const result = await this.datastore.read<UserDto>(this.tableName, id.getId())
        if (!result || !this.userFactory.isDtoValid(result)) {
            return this.getNull()
        }

        return this.userFactory.fromDto(result)
    }

    async findByUsername(username: Username) {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const criteria = (user: UserDto) => {
            return user.username === username.getValue()
        }
        const result = await this.datastore.findOne(this.tableName, criteria)

        if (!result) {
            return this.getNull()
        }
        return this.userFactory.fromDto(result)
    }

    async update(user: User) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new UserNotFoundError()
        }
        const updated = this.datastore.update(this.tableName, user.toDto())
        if (!updated) {
            throw new UserNotFoundError()
        }
    }

    async delete(id: UserIdentification) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new UserNotFoundError()
        }

        const deleted = await this.datastore.delete(this.tableName, id.getId())
        if (!deleted) {
            throw new UserNotFoundError()
        }
    }

    async findByEmail(email: Email): Promise<User> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const criteria = (user: UserDto) => {
            return user.email === email.getValue()
        }
        const result = await this.datastore.findOne(this.tableName, criteria)

        if (!result) {
            return this.getNull()
        }
        return this.userFactory.fromDto(result)
    }

    getNull() {
        return NullUser.getInstance()
    }

}
