import {UserIdentification} from '../../user/UserIdentification.js'
import {UserPermissions} from '../UserPermissions.js'
import {PermissionDto} from './PermissionDto.js'

export interface PermissionDao {
    insert(permission: PermissionDto): Promise<void>
    delete(permission: PermissionDto): Promise<boolean>
    has(permission: PermissionDto): Promise<boolean>
    findUserPermissions(userId: UserIdentification): Promise<UserPermissions>
}