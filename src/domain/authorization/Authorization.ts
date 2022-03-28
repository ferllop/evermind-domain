import {PermissionValidator} from './permission/PermissionValidator.js'
import {UserPermissions} from './UserPermissions.js'
import {UserIsNotAuthorizedError} from '../errors/UserIsNotAuthorizedError.js'

export class Authorization {
    static userWithPermissions(permissions: UserPermissions) {
        return new Authorization(permissions)
    }

    constructor(private userPermissions: UserPermissions) {
    }

    getMissingPermission<T>(Permission: (new (userPermissions: UserPermissions) => PermissionValidator<T>), ...obj: T[]) {
        const permission = new Permission(this.userPermissions)
        return permission.validate(...obj)
    }

    can<T>(Permission: (new (userPermissions: UserPermissions) => PermissionValidator<T>), ...obj: T[]) {
        return this.getMissingPermission(Permission, ...obj).length === 0
    }

    assertCan<T>(Permission: (new (userPermissions: UserPermissions) => PermissionValidator<T>), ...obj: T[]) {
        if (!this.can(Permission, ...obj)) {
            const missingPermissions = this.getMissingPermission(Permission, ...obj)
            throw new UserIsNotAuthorizedError(missingPermissions)
        }
    }
}

