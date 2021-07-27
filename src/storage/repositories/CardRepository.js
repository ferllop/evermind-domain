import { Card } from '../../models/card/Card.js'
import { CardMapper } from '../storables/CardMapper.js'
import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'

export class CardRepository {
    static TABLE_NAME = 'cards'

    /** @type {Datastore} */
    #dataStore

    constructor(dataStore) {
        this.#dataStore = dataStore
    }

    /**
     * @param {Card} card 
     * @returns {Boolean}
     */
    storeCard(card) {
        return this.#dataStore.create(CardRepository.TABLE_NAME, CardMapper.toDto(card))
    }

    /** 
     * @param {Identification} id
     * @returns {boolean}
     * */
    deleteCard(id) {
        if (! this.#dataStore.hasTable(CardRepository.TABLE_NAME)) {
            return false
        }
        return this.#dataStore.delete(CardRepository.TABLE_NAME, id.toString())
    }

    /** 
     * @param {Identification} id
     * @returns {Card}
     */
    retrieveCard(id) {
        if (!this.#dataStore.hasTable(CardRepository.TABLE_NAME)) {
            return null
        }
        const result = this.#dataStore.read(CardRepository.TABLE_NAME, id.toString())
        if (!result || !CardMapper.isDtoValid(result)) {
            return null
        }
        return CardMapper.fromDto(result)
    }

    /**
     * @param {Card} card 
     * @returns {boolean}
     */
    updateCard(card) {
        if (!this.#dataStore.hasTable(CardRepository.TABLE_NAME)) {
            return false
        }
        return this.#dataStore.update(CardRepository.TABLE_NAME, CardMapper.toDto(card))
    }

}
