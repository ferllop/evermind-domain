import {UserPermissions} from './UserPermissions.js'
import {UserIsNotAuthorizedError} from '../../errors/UserIsNotAuthorizedError.js'
import {Authorization} from '../Authorization.js'
import {NewablePermission} from './NewablePermission.js'

export class UserAuthorization implements Authorization {

    static userWithPermissions(permissions: UserPermissions) {
        return new UserAuthorization(permissions)
    }

    constructor(private userPermissions: UserPermissions) {
    }

    getMissingPermission<T>(Permission: NewablePermission<T>, ...obj: T[]) {
        const permission = new Permission(this.userPermissions)
        return permission.validate(...obj)
    }

    can<T>(Permission: NewablePermission<T>, ...obj: T[]) {
        return this.getMissingPermission(Permission, ...obj).length === 0
    }

    assertCan<T>(Permission: NewablePermission<T>, ...obj: T[]) {
        if (!this.can(Permission, ...obj)) {
            const missingPermissions = this.getMissingPermission(Permission, ...obj)
            throw new UserIsNotAuthorizedError(missingPermissions)
        }
    }
}

