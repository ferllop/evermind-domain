import {PermissionDatabaseMap} from './PermissionDatabaseMap.js'
import {UserDatabaseMap} from '../user/UserDatabaseMap.js'
import {Permission} from '../../../../domain/authorization/permission/Permission.js'

export class PermissionSqlQuery {
    createTable() {
        return `CREATE TABLE ${PermissionDatabaseMap.TABLE_NAME}
                (
                    ${PermissionDatabaseMap.USER_ID}     UUID,
                    ${PermissionDatabaseMap.PERMISSION}  TEXT,
                    PRIMARY KEY (${PermissionDatabaseMap.USER_ID}, ${PermissionDatabaseMap.PERMISSION}),
                    FOREIGN KEY (${PermissionDatabaseMap.USER_ID})
                        REFERENCES ${UserDatabaseMap.TABLE_NAME} (${UserDatabaseMap.ID}) ON DELETE CASCADE
                )`
    }

    insert(permission: Permission) {
        return `INSERT INTO ${PermissionDatabaseMap.TABLE_NAME}(${PermissionDatabaseMap.USER_ID},
                                                                  ${PermissionDatabaseMap.PERMISSION})
                VALUES ('${permission.getUserId().getId()}',
                        '${permission.getValue()}')`
    }

    delete(permission: Permission) {
        return `DELETE
                FROM ${PermissionDatabaseMap.TABLE_NAME}
                WHERE ${PermissionDatabaseMap.USER_ID} = '${permission.getUserId().getId()}' AND
                        ${PermissionDatabaseMap.PERMISSION} = '${permission.getValue()}'`
    }

    has(permission: Permission) {
        return `${this.selectAllSubscriptions()} WHERE ${PermissionDatabaseMap.USER_ID} = '${permission.getUserId().getId()}' AND
                        ${PermissionDatabaseMap.PERMISSION} = '${permission.getValue()}'`
    }

    private selectAllSubscriptions() {
        return `SELECT * FROM ${PermissionDatabaseMap.TABLE_NAME}`
    }
}