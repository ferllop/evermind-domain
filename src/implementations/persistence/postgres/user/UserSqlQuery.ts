import {User} from '../../../../domain/user/User.js'
import {UserIdentification} from '../../../../domain/user/UserIdentification.js'
import {UserDatabaseMap} from './UserDatabaseMap.js'
import {Username} from '../../../../domain/user/Username.js'
import {Email} from '../../../../domain/user/Email.js'

export class UserSqlQuery {
    createUsersTable() {
        return `
            CREATE TABLE ${UserDatabaseMap.TABLE_NAME}
            (
                ${UserDatabaseMap.ID}             UUID PRIMARY KEY,
                ${UserDatabaseMap.NAME}           TEXT,
                ${UserDatabaseMap.USERNAME}       TEXT,
                ${UserDatabaseMap.EMAIL}          TEXT,
                ${UserDatabaseMap.DAY_START_TIME} SMALLINT
            );`
    }

    insert(user: User) {
        return `INSERT INTO ${UserDatabaseMap.TABLE_NAME}(${UserDatabaseMap.ID},
                                                          ${UserDatabaseMap.NAME},
                                                          ${UserDatabaseMap.USERNAME},
                                                          ${UserDatabaseMap.EMAIL},
                                                          ${UserDatabaseMap.DAY_START_TIME})
                VALUES ('${user.getId().getId()}',
                        '${user.getName().getValue()}',
                        '${user.getUsername().getValue()}',
                        '${user.getEmail().getValue()}',
                        ${user.getDayStartTime().getValue()})`
    }

    update(user: User) {
        return `UPDATE ${UserDatabaseMap.TABLE_NAME}
                SET ${UserDatabaseMap.NAME}           = '${user.getName().getValue()}',
                    ${UserDatabaseMap.USERNAME}       = '${user.getUsername().getValue()}',
                    ${UserDatabaseMap.EMAIL}          = '${user.getEmail().getValue()}',
                    ${UserDatabaseMap.DAY_START_TIME} = ${user.getDayStartTime().getValue()}
                WHERE ${UserDatabaseMap.ID} = '${user.getId().getId()}'`
    }

    delete(id: UserIdentification) {
        return `DELETE
                FROM ${UserDatabaseMap.TABLE_NAME}
                WHERE ${UserDatabaseMap.ID} = '${id.getId()}'`
    }

    private selectAllUsers() {
        return `SELECT ${UserDatabaseMap.ID},
                       ${UserDatabaseMap.NAME},
                       ${UserDatabaseMap.USERNAME},
                       ${UserDatabaseMap.EMAIL},
                       ${UserDatabaseMap.DAY_START_TIME}
                FROM ${UserDatabaseMap.TABLE_NAME}`
    }

    selectUserById(id: UserIdentification) {
        return `${this.selectAllUsers()} WHERE ${UserDatabaseMap.ID} = '${id.getId()}'`
    }

    selectUserByUsername(username: Username) {
        return `${this.selectAllUsers()} WHERE ${UserDatabaseMap.USERNAME} = '${username.getValue()}'`
    }

    selectUserByEmail(email: Email) {
        return `${this.selectAllUsers()} WHERE ${UserDatabaseMap.EMAIL} = '${email.getValue()}'`
    }
}