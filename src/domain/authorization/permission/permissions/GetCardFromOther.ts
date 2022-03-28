import {Card} from '../../../card/Card.js'
import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../../UserPermissions.js'

export class GetCardFromOther implements PermissionValidator<Card> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(card: Card) {
        if (this.userPermissions.areFromUser(card.getAuthorId())) {
            return []
        }
        const permissionToBeChecked: PermissionValue = 'GET_CARD_FROM_OTHER'
        return this.userPermissions.has(permissionToBeChecked) ? [] : [permissionToBeChecked]
    }
}