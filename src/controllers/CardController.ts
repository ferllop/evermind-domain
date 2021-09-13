import { CardRepository } from '../models/card/CardRepository.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../models/Datastore.js'
import { Card } from '../models/card/Card.js'
import { DomainError } from '../errors/DomainError.js'
import { Labelling } from '../models/card/Labelling.js'
import { CardIdentification } from '../models/card/CardIdentification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { CardDto } from '../models/card/CardDto.js'
import { OnlyRequired } from '../helpers/OnlyRequired.js'

export class CardController {

    storeCard(card: Card, datastore: Datastore): DomainError {
        return new CardRepository(datastore).store(card)
    }

    deleteCard(id: Identification, datastore: Datastore): DomainError {
        return new CardRepository(datastore).delete(id)
    }

    retrieveCard(id: Identification, datastore: Datastore): DomainError | Card {
        return new CardRepository(datastore).retrieve(id)
    }

    updateCard(cardDto: OnlyRequired<CardDto, 'id'>, datastore: Datastore): DomainError {
        const cardRepository = new CardRepository(datastore)
        const {id, ...data} = cardDto
        const card = cardRepository.retrieve(new CardIdentification(id))
        if (card instanceof DomainError) {
            return new DomainError(ErrorType.CARD_NOT_FOUND)
        }

        return new CardRepository(datastore).update(card.apply(data))
    }

    findByLabelling(labelling: Labelling, datastore: Datastore): Card[] {
        return new CardRepository(datastore).findByLabelling(labelling)
    }

    findByAuthorId(authorId: Identification, datastore: Datastore): Card[] {
        return new CardRepository(datastore).findByAuthorId(authorId)
    }

    exists(id: Identification, datastore: Datastore): boolean {
        return this.retrieveCard(id, datastore) instanceof Card
    }

}
