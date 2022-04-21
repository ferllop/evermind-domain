import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'
import {StoredUser} from '../../../user/StoredUser.js'

export class UpdatePrivateUserData implements PermissionValidator<StoredUser> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(user: StoredUser) {
        const permissionToCheck: PermissionValue = user.getId().equals(this.userPermissions.getUserId()) ?
            'UPDATE_OWN_PRIVATE_DATA' : 'UPDATE_PRIVATE_DATA_FROM_OTHERS'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}

