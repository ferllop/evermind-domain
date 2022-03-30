import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'
import {Subscription} from '../../../subscription/Subscription.js'

export class UnsubscribeFromCard implements PermissionValidator<Subscription> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(subscription: Subscription) {
        const permissionToCheck: PermissionValue = subscription.hasUser(this.userPermissions.getUserId())
            ? 'UNSUBSCRIBE_ITSELF_FROM_CARD' : 'UNSUBSCRIBE_OTHER_FROM_CARD'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}