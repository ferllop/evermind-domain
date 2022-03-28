import {Card} from '../../../card/Card.js'
import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'

export class GetCard implements PermissionValidator<Card> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(card: Card) {
        if (card.getVisibility() === 'PRIVATE') {
            const permissionToBeChecked: PermissionValue = 'GET_PRIVATE_CARD_FROM_OTHER'
            return this.userPermissions.has(permissionToBeChecked) ? [] : [permissionToBeChecked]
        }
        return []
    }
}