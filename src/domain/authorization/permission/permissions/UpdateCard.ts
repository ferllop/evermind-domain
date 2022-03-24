import {Card} from '../../../card/Card.js'
import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../../UserPermissions.js'

export class UpdateCard implements PermissionValidator {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(card: Card) {
        const permissionToBeChecked: PermissionValue =  card.hasAuthorId(this.userPermissions.getUserId())
            ? 'UPDATE_OWN_CARD'
            : 'UPDATE_CARD_FROM_OTHER'
        return this.userPermissions.has(permissionToBeChecked) ? [] : [permissionToBeChecked]
    }
}