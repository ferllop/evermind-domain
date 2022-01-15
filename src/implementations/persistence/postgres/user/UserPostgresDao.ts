import {User} from '../../../../domain/user/User'
import {PostgresErrorType} from '../PostgresDatastore'
import {DomainError} from '../../../../domain/errors/DomainError'
import {ErrorType} from '../../../../domain/errors/ErrorType'
import {UserIdentification} from '../../../../domain/user/UserIdentification'
import {NullUser} from '../../../../domain/user/NullUser'
import {UserSqlQuery} from './UserSqlQuery'
import {UserPostgresDatastore} from "./UserPostgresDatastore";
import {UserPostgresMapper} from "./UserPostgresMapper";
import {UserDao} from "../../../../domain/user/UserDao";

export class UserPostgresDao implements UserDao {

    private readonly sqlQuery = new UserSqlQuery()

    constructor(private datastore: UserPostgresDatastore = new UserPostgresDatastore()) {
    }

    async insert(user: User) {
        const query = this.sqlQuery.insert(user)

        try {
            await this.datastore.query(query)
        } catch (error) {
            if (error.code === PostgresErrorType.NOT_UNIQUE_FIELD) {
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

    async findById(id: UserIdentification): Promise<User> {
        const query = this.sqlQuery.selectUserById(id)
        const result = await this.datastore.query(query)
        if (result.rowCount > 1) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
        return result.rowCount > 0
            ? new UserPostgresMapper().rowToUser(result.rows[0])
            : NullUser.getInstance()
    }

}
