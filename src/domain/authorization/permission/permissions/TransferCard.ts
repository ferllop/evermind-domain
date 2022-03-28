import {PermissionValidator} from '../PermissionValidator.js'
import {Card} from '../../../card/Card.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'

export class TransferCard implements PermissionValidator<Card> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(card: Card) {
        const permissionToCheck: PermissionValue = card.hasAuthorId(this.userPermissions.getUserId())
            ? 'TRANSFER_OWN_CARD' : 'TRANSFER_CARD_FROM_ANOTHER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}