import { CardRepository } from '../storage/repositories/CardRepository.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Card } from '../models/card/Card.js'
import { DomainError } from '../errors/DomainError.js'

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

    updateCard(card: Card, datastore: Datastore): DomainError {
        return new CardRepository(datastore).update(card)
    }

    findByLabels(labels: string[], datastore: Datastore): Card[] {
        return new CardRepository(datastore).findByLabels(labels)
    }

    findByAuthorId(authorId: Identification, datastore: Datastore): Card[] {
        return new CardRepository(datastore).findByAuthorId(authorId)
    }

    exists(id: Identification, datastore: Datastore): boolean {
        return this.retrieveCard(id, datastore) instanceof Card
    }

}
