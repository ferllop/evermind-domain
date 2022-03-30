import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'
import {Subscription} from '../../../subscription/Subscription.js'

export class SubscribeToCard implements PermissionValidator<Subscription> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(subscription: Subscription) {
        const permissionToCheck: PermissionValue = subscription.hasUser(this.userPermissions.getUserId())
            ? 'SUBSCRIBE_ITSELF_TO_CARD' : 'SUBSCRIBE_OTHER_TO_CARD'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}