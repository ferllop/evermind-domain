import { Card } from '../models/card/Card.js'
import { CardRepository } from '../storage/repositories/CardRepository.js'
import { InMemoryDatastore } from '../storage/datastores/InMemoryDatastore.js'

export class CardController {

    /**
     * @param {object} dto 
     * @returns {Id}
     */
    storeCard(dto) {
        return new CardRepository(InMemoryDatastore.getInstance()).storeCard(dto)
    }

    /** 
     * @param {Id} id
     * @returns {boolean}
     * */
    deleteCard(id) {
        return new CardRepository(InMemoryDatastore.getInstance()).deleteCard(id)
    }

    /** 
     * @param {Id} id
     * @returns {Card}
     */
    retrieveCard(id) {
        return new CardRepository(InMemoryDatastore.getInstance()).retrieveCard(id)
    }

    /**
     * @param {Id} id 
     * @param {object} dto 
     * @returns {boolean}
     */
    updateCard(id, dto) {
        return new CardRepository(InMemoryDatastore.getInstance()).updateCard(id, dto)
    }

}
