import {PermissionValidator} from '../PermissionValidator.js'
import {Card} from '../../../card/Card.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'

export class CreateCard implements PermissionValidator<Card> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(card: Card) {
        const permissionToCheck: PermissionValue = card.hasAuthorId(this.userPermissions.getUserId())
            ? 'CREATE_OWN_CARD' : 'CREATE_CARD_FOR_OTHER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}