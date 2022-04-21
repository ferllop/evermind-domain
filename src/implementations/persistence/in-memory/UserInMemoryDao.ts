import {UserDao} from '../../../domain/user/UserDao.js'
import {InMemoryDatastore} from './InMemoryDatastore.js'
import {UserIdentification} from '../../../domain/user/UserIdentification.js'
import {UserDto} from '../../../domain/user/UserDto.js'
import {UserFactory} from '../../../domain/user/UserFactory.js'
import {User} from '../../../domain/user/User.js'
import {Username} from '../../../domain/user/Username.js'
import {UserNotFoundError} from '../../../domain/errors/UserNotFoundError.js'
import {DataFromStorageNotValidError} from '../../../domain/errors/DataFromStorageNotValidError.js'
import {StoredUser} from '../../../domain/user/StoredUser.js'
import {NullStoredUser} from '../../../domain/user/NullStoredUser.js'

export class UserInMemoryDao implements UserDao {

    protected readonly tableName = 'users'
    protected userFactory = new UserFactory()
    protected datastore: InMemoryDatastore

    constructor() {
        this.datastore = new InMemoryDatastore()
    }

    async insert(user: User) {
        const entity = new StoredUser(user, UserIdentification.create())
        const result = await this.datastore.create(this.tableName, entity.toDto())
        if (!result) {
            throw new DataFromStorageNotValidError()
        }
        return entity
    }

    async findById(id: UserIdentification): Promise<StoredUser> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return NullStoredUser.getInstance()
        }

        const result = await this.datastore.read<UserDto>(this.tableName, id.getId())
        if (!result || !this.userFactory.isDtoValid(result)) {
            return NullStoredUser.getInstance()
        }

        return this.userFactory.fromDto(result)
    }

    async findByUsername(username: Username) {
        if (!await this.datastore.hasTable(this.tableName)) {
            return NullStoredUser.getInstance()
        }

        const criteria = (user: UserDto) => {
            return user.username === username.getValue()
        }
        const result = await this.datastore.findOne(this.tableName, criteria)

        if (!result) {
            return NullStoredUser.getInstance()
        }
        return this.userFactory.fromDto(result)
    }

    async update(user: StoredUser) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new UserNotFoundError()
        }
        const updated = this.datastore.update(this.tableName, user.toDto())
        if (!updated) {
            throw new UserNotFoundError()
        }
    }

    async delete(user: StoredUser) {
        const deleted = await this.datastore.delete(this.tableName, user.getId().getId())
        if (!deleted) {
            throw new UserNotFoundError()
        }
    }

}
