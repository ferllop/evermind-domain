import {UserDao} from '../../../domain/user/UserDao'
import {InMemoryDatastore} from './InMemoryDatastore'
import {UserIdentification} from '../../../domain/user/UserIdentification'
import {UserDto} from '../../../domain/user/UserDto'
import {UserFactory} from '../../../domain/user/UserFactory'
import {User} from '../../../domain/user/User'
import {DomainError} from '../../../domain/errors/DomainError'
import {NullUser} from '../../../domain/user/NullUser'
import {ErrorType} from '../../../domain/errors/ErrorType'
import {Username} from '../../../domain/user/Username'

export class UserInMemoryDao implements UserDao {

    protected readonly tableName = 'users'
    protected mapper = new UserFactory()
    protected datastore: InMemoryDatastore

    constructor() {
        this.datastore = new InMemoryDatastore()
    }

    async insert(user: User) {
        const result = await this.datastore.create(this.tableName, user.toDto())
        if (!result) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
    }

    async findById(id: UserIdentification): Promise<User> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const result = await this.datastore.read<UserDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return this.getNull()
        }

        return this.mapper.fromDto(result)
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

        return this.mapper.fromDto(result)

    }

    async update(user: User) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }
        const updated = this.datastore.update(this.tableName, user.toDto())
        if (!updated) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }
    }

    async delete(id: UserIdentification) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }

        const deleted = await this.datastore.delete(this.tableName, id.getId())
        if (!deleted) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }

    }

    getNull() {
        return NullUser.getInstance()
    }

}
