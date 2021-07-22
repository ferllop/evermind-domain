import { Card } from '../models/card/Card.js'
import { CardRepository } from '../repositories/CardRepository.js'
import { MemoryStorage } from '../storage/storages/MemoryStorage.js'

export class CardController {

    /**
     * @param {object} dto 
     * @returns {Id}
     */
    storeCard(dto) {
        return new CardRepository(MemoryStorage.getInstance()).storeCard(dto)
    }

    /** 
     * @param {Id} id
     * @returns {boolean}
     * */
    deleteCard(id) {
        return new CardRepository(MemoryStorage.getInstance()).deleteCard(id)
    }

    /** 
     * @param {Id} id
     * @returns {Card}
     */
    retrieveCard(id) {
        return new CardRepository(MemoryStorage.getInstance()).retrieveCard(id)
    }

    /**
     * @param {Id} id 
     * @param {object} dto 
     * @returns {boolean}
     */
    updateCard(id, dto) {
        return new CardRepository(MemoryStorage.getInstance()).updateCard(id, dto)
    }

}
