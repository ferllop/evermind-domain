import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'

export class CreateUserAccount implements PermissionValidator<null> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate() {
        const permissionToCheck: PermissionValue = this.userPermissions.isUserAnonymous()
            ? 'CREATE_OWN_USER_ACCOUNT'
            : 'CREATE_ACCOUNT_FOR_OTHER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}

