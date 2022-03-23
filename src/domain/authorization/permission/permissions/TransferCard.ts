import {UserIdentification} from '../../../user/UserIdentification.js'
import {Card} from '../../../card/Card.js'
import {PermissionValidator} from '../PermissionValidator.js'
import {Permission} from '../Permission.js'

export class TransferCard implements PermissionValidator {
    constructor(private userId: UserIdentification) {
    }

    async validate(card: Card) {
        if (card.hasAuthorId(this.userId)) {
            return new Permission(this.userId, 'TRANSFER_OWN_CARD').validate()
        }
        return new Permission(this.userId, 'TRANSFER_CARD_FROM_ANOTHER').validate()
    }
}

