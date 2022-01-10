import {User} from '../../../domain/user/User'
import {UserIdentification} from '../../../domain/user/UserIdentification'

export enum UserDatabaseMap {
    TABLE_NAME = 'users',
    ID = 'id',
    NAME = 'name',
    USERNAME = 'username',
    DAY_START_TIME = 'day_start_time',
}

export class UserSqlQuery {
    createUsersTable() {
        return `
            CREATE TABLE ${UserDatabaseMap.TABLE_NAME}(
                ${UserDatabaseMap.ID} UUID PRIMARY KEY,
                ${UserDatabaseMap.NAME} TEXT,
                ${UserDatabaseMap.USERNAME} TEXT,
                ${UserDatabaseMap.DAY_START_TIME} SMALLINT
            );`
    }

    insert(user: User) {
        return `BEGIN;
        INSERT INTO ${UserDatabaseMap.TABLE_NAME}(
            ${UserDatabaseMap.ID},
            ${UserDatabaseMap.NAME},
            ${UserDatabaseMap.USERNAME},
            ${UserDatabaseMap.DAY_START_TIME}            
            ) VALUES (
            '${user.getId().getId()}',
            '${user.getName().getValue()}',
            '${user.getUsername().getValue()}',
            ${user.getDayStartTime().getValue()});
            COMMIT;`
    }

    update(user: User) {
        return `BEGIN;
            UPDATE ${UserDatabaseMap.TABLE_NAME} SET 
            ${UserDatabaseMap.NAME} = '${user.getName().getValue()}',
            ${UserDatabaseMap.USERNAME} = '${user.getUsername().getValue()}'
            WHERE ${UserDatabaseMap.ID} = '${user.getId().getId()}';
            COMMIT;`
    }

    delete(id: UserIdentification) {
        return `DELETE FROM ${UserDatabaseMap.TABLE_NAME} WHERE id = '${id.getId()}'`
    }

    selectById(id: UserIdentification) {
        return `SELECT 
        ${UserDatabaseMap.ID}, 
        ${UserDatabaseMap.NAME},
        ${UserDatabaseMap.USERNAME},
        ${UserDatabaseMap.DAY_START_TIME}
            FROM ${UserDatabaseMap.TABLE_NAME}
            WHERE ${UserDatabaseMap.ID} = '${id.getId()}'`
    }
}