import {PermissionDatabaseMap} from './PermissionDatabaseMap.js'
import {UserDatabaseMap} from '../user/UserDatabaseMap.js'
import {UserIdentification} from '../../../../domain/user/UserIdentification.js'
import {PermissionDto} from '../../../../domain/authorization/permission/PermissionDto.js'

export class PermissionSqlQuery {
    createTable() {
        return `CREATE TABLE ${PermissionDatabaseMap.TABLE_NAME}
                (
                    ${PermissionDatabaseMap.USER_ID} UUID,
                    ${PermissionDatabaseMap.VALUE}   TEXT,
                    PRIMARY KEY (${PermissionDatabaseMap.USER_ID}, ${PermissionDatabaseMap.VALUE}),
                    FOREIGN KEY (${PermissionDatabaseMap.USER_ID})
                        REFERENCES ${UserDatabaseMap.TABLE_NAME} (${UserDatabaseMap.ID}) ON DELETE CASCADE
                )`
    }

    insert(permission: PermissionDto) {
        return `INSERT INTO ${PermissionDatabaseMap.TABLE_NAME}(${PermissionDatabaseMap.USER_ID},
                                                                  ${PermissionDatabaseMap.VALUE})
                VALUES ('${permission.userId}',
                        '${permission.value}')`
    }

    delete(permission: PermissionDto) {
        return `DELETE
                FROM ${PermissionDatabaseMap.TABLE_NAME}
                WHERE ${PermissionDatabaseMap.USER_ID} = '${permission.userId}' AND
                        ${PermissionDatabaseMap.VALUE} = '${permission.value}'`
    }

    has(permission: PermissionDto) {
        return `${this.selectAllSubscriptions()} WHERE ${PermissionDatabaseMap.USER_ID} = '${permission.userId}' AND
                        ${PermissionDatabaseMap.VALUE} = '${permission.value}'`
    }

    findByUserId(userId: UserIdentification) {
        return `${this.selectAllSubscriptions()} WHERE ${PermissionDatabaseMap.USER_ID} = '${userId.getValue()}'`
    }

    private selectAllSubscriptions() {
        return `SELECT * FROM ${PermissionDatabaseMap.TABLE_NAME}`
    }
}