import { CardRepository } from '../storage/repositories/CardRepository.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'
import { CardDto } from '../models/card/CardDto.js'
import { Card } from '../models/card/Card.js'

export class CardController {

    storeCard(dto: CardDto, datastore: Datastore): Response<null> {
        if (!CardMapper.isDtoValid(dto)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = CardMapper.fromDto(dto)
        const result = new CardRepository(datastore).storeCard(card)
        if (!result) {
            return Response.withError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return Response.OkWithoutData()
    }

    deleteCard({id}: Identified, datastore: Datastore): Response<null> {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const deleted = new CardRepository(datastore).deleteCard(new Identification(id))
        if (!deleted) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return Response.OkWithoutData()
    }

    retrieveCard({id}: Identified, datastore: Datastore): Response<CardDto|null> {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const retrieved = new CardRepository(datastore).retrieveCard(new Identification(id))
        if (!retrieved) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithData(CardMapper.toDto(retrieved))
    }

    updateCard(dto: CardDto, datastore: Datastore): Response<null> {
        if (!CardMapper.isDtoValid(dto)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = CardMapper.fromDto(dto)
        const updated = new CardRepository(datastore).updateCard(card)
        if(!updated) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithoutData()
    }

    findByLabels(labels: string[], datastore: Datastore): Response<Card[]> {
        const result = new CardRepository(datastore).findByLabels(labels)
        return Response.OkWithData(result)
    }

    findByAuthorId(authorId: Identification, datastore: Datastore): Response<Card[]> {
        const result = new CardRepository(datastore).findByAuthorId(authorId)
        return Response.OkWithData(result)
    }

}
