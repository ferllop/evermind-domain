import { CardRepository } from '../storage/repositories/CardRepository.js'
import { InMemoryDatastore } from '../storage/datastores/InMemoryDatastore.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'

export class CardController {

    /**
     * @param {object} dto 
     * @returns {Response}
     */
    storeCard(dto) {
        if (!CardMapper.isDtoValid(dto)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = CardMapper.fromDto(dto)
        const result = new CardRepository(InMemoryDatastore.getInstance()).storeCard(card)
        if (!result) {
            return Response.withError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return Response.OkWithoutData()
    }

    /** 
     * @param {object} dto
     * @returns {Response}
     * */
    deleteCard({id}) {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const deleted = new CardRepository(InMemoryDatastore.getInstance()).deleteCard(new Identification(id))
        if (!deleted) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return Response.OkWithoutData()
    }

    /** 
     * @param {object} dto
     * @returns {Response}
     */
    retrieveCard({id}) {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const retrieved = new CardRepository(InMemoryDatastore.getInstance()).retrieveCard(new Identification(id))
        if (!retrieved) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithData(CardMapper.toDto(retrieved))
    }

    /**
     * @param {object} dto 
     * @returns {Response}
     */
    updateCard(dto) {
        if (!CardMapper.isDtoValid(dto)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = CardMapper.fromDto(dto)
        const updated = new CardRepository(InMemoryDatastore.getInstance()).updateCard(card)
        if(!updated) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithoutData()
    }

}
