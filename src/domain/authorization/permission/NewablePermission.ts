import {UserPermissions} from './UserPermissions.js'
import {PermissionValidator} from './PermissionValidator.js'

export type NewablePermission<T> = (new (userPermissions: UserPermissions) => PermissionValidator<T>)