import {PermissionDao} from '../../../domain/authorization/permission/PermissionDao.js'
import {UserPermissions} from '../../../domain/authorization/UserPermissions.js'

export class PermissionNullDao implements PermissionDao {
    findUserPermissions(): Promise<UserPermissions> {
        throw new Error('Method not implemented')
    }

    has(): Promise<boolean> {
        throw new Error('Method not implemented')
    }

    delete(): Promise<boolean> {
        throw new Error('Method not implemented')
    }

    insert(): Promise<void> {
        throw new Error('Method not implemented')
    }



}