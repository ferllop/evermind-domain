import {User} from '../../../../domain/user/User.js'
import {UserIdentification} from '../../../../domain/user/UserIdentification.js'
import {UserSqlQuery} from './UserSqlQuery.js'
import {UserPostgresDatastore} from './UserPostgresDatastore.js'
import {UserPostgresMapper} from './UserPostgresMapper.js'
import {UserDao} from '../../../../domain/user/UserDao.js'
import {Username} from '../../../../domain/user/Username.js'
import {PostgresErrorType} from '../PostgresErrorType.js'
import {PostgresDatastoreError} from '../PostgresDatastoreError.js'
import {UserAlreadyExistsError} from '../../../../domain/errors/UserAlreadyExistsError.js'
import {UserNotFoundError} from '../../../../domain/errors/UserNotFoundError.js'
import {DataFromStorageNotValidError} from '../../../../domain/errors/DataFromStorageNotValidError.js'
import {StoredUser} from '../../../../domain/user/StoredUser.js'
import {NullStoredUser} from '../../../../domain/user/NullStoredUser.js'

export class UserPostgresDao implements UserDao {

    private readonly sqlQuery = new UserSqlQuery()

    constructor(private datastore: UserPostgresDatastore = new UserPostgresDatastore()) {
    }

    async insert(user: User) {
        const entity = new StoredUser(user, UserIdentification.create())
        const query = this.sqlQuery.insert(entity)

        try {
            await this.datastore.query(query)
            return entity
        } catch (error) {
            if (error instanceof PostgresDatastoreError &&
                error.code === PostgresErrorType.NOT_UNIQUE_FIELD) {
                throw new UserAlreadyExistsError()
            }
            throw error
        }
    }

    async delete(id: UserIdentification) {
        const query = this.sqlQuery.delete(id)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new UserNotFoundError()
        }
    }

    async update(user: StoredUser) {
        const query = this.sqlQuery.update(user)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new UserNotFoundError()
        }
    }

    private async findOne(query: string): Promise<StoredUser> {
        const result = await this.datastore.query(query)
        if (result.rowCount > 1) {
            throw new DataFromStorageNotValidError()
        }
        return result.rowCount > 0
            ? new UserPostgresMapper().rowToUser(result.rows[0])
            : NullStoredUser.getInstance()
    }

    async findById(id: UserIdentification): Promise<StoredUser> {
        const query = this.sqlQuery.selectUserById(id)
        return this.findOne(query)
    }

    async findByUsername(username: Username): Promise<StoredUser> {
        const query = this.sqlQuery.selectUserByUsername(username)
        return this.findOne(query)
    }

}
