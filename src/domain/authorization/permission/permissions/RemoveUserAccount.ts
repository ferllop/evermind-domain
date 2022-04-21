import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'
import {StoredUser} from '../../../user/StoredUser.js'

export class RemoveUserAccount implements PermissionValidator<StoredUser> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(user: StoredUser) {
        const permissionToCheck: PermissionValue = user.getId().equals(this.userPermissions.getUserId()) ?
            'REMOVE_OWN_ACCOUNT' : 'REMOVE_ACCOUNT_FROM_OTHER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}

