import {PermissionValidator} from './permission/PermissionValidator.js'
import {UserIsNotAuthorizedError} from '../errors/UserIsNotAuthorizedError.js'
import {UserPermissions} from './UserPermissions.js'

export class Authorization {
    static assertUserWithPermissions(permissions: UserPermissions) {
        return new Authorization(permissions)
    }

    constructor(private userPermissions: UserPermissions) {
    }

    can<T>(Permission: (new (userPermissions: UserPermissions) => PermissionValidator<T>), ...obj: T[]) {
        const permission = new Permission(this.userPermissions)
        const missingPermissions = permission.validate(...obj)
        if (missingPermissions.length > 0) {
            throw new UserIsNotAuthorizedError(missingPermissions)
        }
    }

}