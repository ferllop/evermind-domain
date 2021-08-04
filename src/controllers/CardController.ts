import { CardRepository } from '../storage/repositories/CardRepository.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Card } from '../models/card/Card.js'
import { DomainError } from '../errors/DomainError.js'

export class CardController {

    storeCard(card: Card, datastore: Datastore): DomainError {
        const result = new CardRepository(datastore).storeCard(card)
        if (!result) {
            return new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return DomainError.NULL
    }

    deleteCard(id: Identification, datastore: Datastore): DomainError {
        const deleted = new CardRepository(datastore).deleteCard(id)
        if (!deleted) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return DomainError.NULL
    }

    retrieveCard(id: Identification, datastore: Datastore): DomainError | Card {
        const cardRetrieved = new CardRepository(datastore).retrieveCard(id)
        if (!cardRetrieved) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return cardRetrieved
    }

    updateCard(card: Card, datastore: Datastore): DomainError {
        const updated = new CardRepository(datastore).updateCard(card)
        if(!updated) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return DomainError.NULL
    }

    findByLabels(labels: string[], datastore: Datastore): Card[] {
        return new CardRepository(datastore).findByLabels(labels)
    }

    findByAuthorId(authorId: Identification, datastore: Datastore): Card[] {
        return new CardRepository(datastore).findByAuthorId(authorId)
    }

}
