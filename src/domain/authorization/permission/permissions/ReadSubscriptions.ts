import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'
import {StoredUser} from '../../../user/StoredUser.js'

export class ReadSubscriptions implements PermissionValidator<StoredUser> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(user: StoredUser) {
        const permissionToCheck: PermissionValue = this.userPermissions.areFromUser(user) ?
            'READ_OWN_SUBSCRIPTIONS' : 'READ_SUBSCRIPTIONS_FROM_ANOTHER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}

