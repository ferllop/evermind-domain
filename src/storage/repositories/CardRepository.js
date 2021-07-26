import { Card } from '../../models/card/Card.js'
import { CardMapper } from '../storables/CardMapper.js'
import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'

export class CardRepository {
    static CARD_TABLE = 'cards'

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
        return this.#dataStore.create(CardRepository.CARD_TABLE, CardMapper.toDto(card))
    }

    /** 
     * @param {Identification} id
     * @returns {boolean}
     * */
    deleteCard(id) {
        if (! this.#dataStore.hasTable(CardRepository.CARD_TABLE)) {
            return false
        }
        return this.#dataStore.delete(CardRepository.CARD_TABLE, id.toString())
    }

    /** 
     * @param {Identification} id
     * @returns {Card}
     */
    retrieveCard(id) {
        if (!this.#dataStore.hasTable(CardRepository.CARD_TABLE)) {
            return null
        }
        const result = this.#dataStore.read(CardRepository.CARD_TABLE, id.toString())
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
        if (!this.#dataStore.hasTable(CardRepository.CARD_TABLE)) {
            return false
        }
        return this.#dataStore.update(CardRepository.CARD_TABLE, CardMapper.toDto(card))
    }

}
