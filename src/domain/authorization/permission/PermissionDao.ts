import {Permission} from './Permission.js'

export interface PermissionDao {
    insert(permission: Permission): Promise<void>
    delete(permission: Permission): Promise<boolean>
    has(permission: Permission): Promise<boolean>

}