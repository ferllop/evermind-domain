import {User} from '../../../../domain/user/User'
import {UserIdentification} from '../../../../domain/user/UserIdentification'
import {UserDatabaseMap} from './UserDatabaseMap'

export class UserSqlQuery {
    createUsersTable() {
        return `
            CREATE TABLE ${UserDatabaseMap.TABLE_NAME}
            (
                ${UserDatabaseMap.ID}             UUID PRIMARY KEY,
                ${UserDatabaseMap.NAME}           TEXT,
                ${UserDatabaseMap.USERNAME}       TEXT,
                ${UserDatabaseMap.DAY_START_TIME} SMALLINT
            );`
    }

    insert(user: User) {
        return `INSERT INTO ${UserDatabaseMap.TABLE_NAME}(${UserDatabaseMap.ID},
                                                          ${UserDatabaseMap.NAME},
                                                          ${UserDatabaseMap.USERNAME},
                                                          ${UserDatabaseMap.DAY_START_TIME})
                VALUES ('${user.getId().getId()}',
                        '${user.getName().getValue()}',
                        '${user.getUsername().getValue()}',
                        ${user.getDayStartTime().getValue()})`
    }

    update(user: User) {
        return `UPDATE ${UserDatabaseMap.TABLE_NAME}
                SET ${UserDatabaseMap.NAME}           = '${user.getName().getValue()}',
                    ${UserDatabaseMap.USERNAME}       = '${user.getUsername().getValue()}',
                    ${UserDatabaseMap.DAY_START_TIME} = ${user.getDayStartTime().getValue()}
                WHERE ${UserDatabaseMap.ID} = '${user.getId().getId()}'`
    }

    delete(id: UserIdentification) {
        return `DELETE
                FROM ${UserDatabaseMap.TABLE_NAME}
                WHERE ${UserDatabaseMap.ID} = '${id.getId()}'`
    }

    selectUserById(id: UserIdentification) {
        return `SELECT ${UserDatabaseMap.ID},
                       ${UserDatabaseMap.NAME},
                       ${UserDatabaseMap.USERNAME},
                       ${UserDatabaseMap.DAY_START_TIME}
                FROM ${UserDatabaseMap.TABLE_NAME}
                WHERE ${UserDatabaseMap.ID} = '${id.getId()}'`
    }
}