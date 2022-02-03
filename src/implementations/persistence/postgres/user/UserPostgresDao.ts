import {User} from '../../../../domain/user/User.js'
import {DomainError} from '../../../../domain/errors/DomainError.js'
import {ErrorType} from '../../../../domain/errors/ErrorType.js'
import {UserIdentification} from '../../../../domain/user/UserIdentification.js'
import {NullUser} from '../../../../domain/user/NullUser.js'
import {UserSqlQuery} from './UserSqlQuery.js'
import {UserPostgresDatastore} from './UserPostgresDatastore.js'
import {UserPostgresMapper} from './UserPostgresMapper.js'
import {UserDao} from '../../../../domain/user/UserDao.js'
import {Username} from '../../../../domain/user/Username.js'
import {PostgresErrorType} from '../PostgresErrorType.js'
import {PostgresDatastoreError} from '../PostgresDatastoreError.js'

export class UserPostgresDao implements UserDao {

    private readonly sqlQuery = new UserSqlQuery()

    constructor(private datastore: UserPostgresDatastore = new UserPostgresDatastore()) {
    }

    async insert(user: User) {
        const query = this.sqlQuery.insert(user)

        try {
            await this.datastore.query(query)
        } catch (error) {
            console.log(error)
            if (error instanceof PostgresDatastoreError &&
                error.code === PostgresErrorType.NOT_UNIQUE_FIELD) {
                throw new DomainError(ErrorType.USER_ALREADY_EXISTS)
            }
            throw error
        }
    }

    async delete(id: UserIdentification) {
        const query = this.sqlQuery.delete(id)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }
    }

    async update(user: User) {
        const query = this.sqlQuery.update(user)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }
    }

    private async findOne(query: string): Promise<User> {
        const result = await this.datastore.query(query)
        if (result.rowCount > 1) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
        return result.rowCount > 0
            ? new UserPostgresMapper().rowToUser(result.rows[0])
            : NullUser.getInstance()
    }

    async findById(id: UserIdentification): Promise<User> {
        const query = this.sqlQuery.selectUserById(id)
        return this.findOne(query)

    }

    async findByUsername(username: Username): Promise<User> {
        const query = this.sqlQuery.selectUserByUsername(username)
        return this.findOne(query)
    }



}
