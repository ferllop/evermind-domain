import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'
import {User} from '../../../user/User.js'

export class ReadSubscriptions implements PermissionValidator<User> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(user: User) {
        const permissionToCheck: PermissionValue = this.userPermissions.areFromUser(user) ?
            'READ_OWN_SUBSCRIPTIONS' : 'READ_SUBSCRIPTIONS_FROM_ANOTHER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}

