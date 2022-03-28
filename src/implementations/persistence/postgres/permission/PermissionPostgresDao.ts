import {PermissionDao} from '../../../../domain/authorization/permission/PermissionDao.js'
import {PermissionSqlQuery} from './PermissionSqlQuery.js'
import {PermissionPostgresDatastore} from './PermissionPostgresDatastore.js'
import {UserIdentification} from '../../../../domain/user/UserIdentification.js'
import {UserPermissions} from '../../../../domain/authorization/permission/UserPermissions.js'
import {PermissionDto} from '../../../../domain/authorization/permission/PermissionDto.js'

export class PermissionPostgresDao implements PermissionDao {

    private sqlQuery = new PermissionSqlQuery()

    constructor(private datastore: PermissionPostgresDatastore = new PermissionPostgresDatastore()) {
    }

    async insert(permission: PermissionDto) {
        const query = this.sqlQuery.insert(permission)
        await this.datastore.query(query)
    }

    async delete(permission: PermissionDto): Promise<boolean> {
        const query = this.sqlQuery.delete(permission)
        const result = await this.datastore.query(query)
        return result.rowCount > 0
    }

    async has(permission: PermissionDto): Promise<boolean> {
        const query = this.sqlQuery.has(permission)
        const result = await this.datastore.query(query)
        return result.rowCount > 0
    }

    async findUserPermissions(userId: UserIdentification): Promise<UserPermissions> {
        const query = this.sqlQuery.findByUserId(userId)
        const result = await this.datastore.query(query)
        return new UserPermissions(userId, result.rows.map(row => row.value))
    }


}


