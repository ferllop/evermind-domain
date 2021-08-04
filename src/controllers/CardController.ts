import { CardRepository } from '../storage/repositories/CardRepository.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'
import { CardDto } from '../models/card/CardDto.js'
import { Card } from '../models/card/Card.js'
import { DomainError } from '../errors/DomainError.js'
import { IdDto } from '../models/value/IdDto.js'

export class CardController {

    storeCard(dto: CardDto, datastore: Datastore): DomainError {
        if (!CardMapper.isDtoValid(dto)) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = CardMapper.fromDto({id: '', ...dto})
        const result = new CardRepository(datastore).storeCard(card)
        if (!result) {
            return new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return DomainError.NULL
    }

    deleteCard({id}: IdDto, datastore: Datastore): DomainError {
        if(!id) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const deleted = new CardRepository(datastore).deleteCard(new Identification(id))
        if (!deleted) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return DomainError.NULL
    }

    retrieveCard({id}: IdDto, datastore: Datastore): DomainError | Card {
        if(!id) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const cardRetrieved = new CardRepository(datastore).retrieveCard(new Identification(id))
        if (!cardRetrieved) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return cardRetrieved
    }

    updateCard(dto: Identified<CardDto>, datastore: Datastore): DomainError {
        if (!CardMapper.isDtoValid(dto)) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = CardMapper.fromDto(dto)
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
