import {Card} from '../../../card/Card.js'
import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../../UserPermissions.js'

export class DeleteCard implements PermissionValidator<Card> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(card: Card) {
        const permissionToCheck: PermissionValue = card.getAuthorId().equals(this.userPermissions.getUserId()) ?
            'DELETE_OWN_CARD' : 'DELETE_CARD_FROM_OTHER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}

