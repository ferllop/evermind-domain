import {PermissionDao} from '../../../../domain/authorization/permission/PermissionDao.js'
import {Permission} from '../../../../domain/authorization/permission/Permission.js'
import {PermissionSqlQuery} from './PermissionSqlQuery.js'
import {PermissionPostgresDatastore} from './PermissionPostgresDatastore.js'

export class PermissionPostgresDao implements PermissionDao {

    private sqlQuery = new PermissionSqlQuery()

    constructor(private datastore: PermissionPostgresDatastore = new PermissionPostgresDatastore()) {
    }

    async insert(permission: Permission) {
        const query = this.sqlQuery.insert(permission)
        await this.datastore.query(query)
    }

    async delete(permission: Permission): Promise<boolean> {
        const query = this.sqlQuery.delete(permission)
        const result = await this.datastore.query(query)
        return result.rowCount > 0
    }

    async has(permission: Permission): Promise<boolean> {
        const query = this.sqlQuery.has(permission)
        const result = await this.datastore.query(query)
        return result.rowCount > 0
    }

}


