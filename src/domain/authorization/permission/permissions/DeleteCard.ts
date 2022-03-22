import {UserIdentification} from '../../../user/UserIdentification.js'
import {Card} from '../../../card/Card.js'
import {PermissionValidator} from '../PermissionValidator.js'
import {Permission} from '../Permission.js'

export class DeleteCard implements PermissionValidator {
    constructor(private userId: UserIdentification) {
    }

    async validate(card: Card) {
        if (card.getAuthorId().equals(this.userId)) {
            return new Permission(this.userId, 'DELETE_OWN_CARD').validate()
        }
        return new Permission(this.userId, 'DELETE_CARD_FROM_OTHER').validate()
    }
}

