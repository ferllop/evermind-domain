import {UserIdentification} from '../../../user/UserIdentification.js'
import {Card} from '../../../card/Card.js'
import {AsyncPermissionValidator} from '../../../shared/AsyncPermissionValidator.js'
import {CreateOwnCard} from './CreateOwnCard.js'
import {CreateCardForOther} from './CreateCardForOther.js'

export class CreateCard implements AsyncPermissionValidator {
    constructor(private userId: UserIdentification) {
    }

    async validate(card: Card) {
        if (card.getAuthorId().equals(this.userId)) {
            return new CreateOwnCard(this.userId).validate()
        }
        return new CreateCardForOther(this.userId).validate()
    }
}

