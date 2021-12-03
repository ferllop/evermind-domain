import { CardIdentification } from '../card/CardIdentification.js';
import { UserIdentification } from '../user/UserIdentification.js';
import { Identification } from '../value/Identification.js';

export class SubscriptionIdentification extends Identification {
    SEPARATOR = '#'

    constructor(userId: UserIdentification, cardId: CardIdentification) {
        super(userId.getId() + '#' + cardId.getId())
    }


    
}
