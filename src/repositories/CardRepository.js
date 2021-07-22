import '../models/card/CardDto.js'
import { Card } from '../models/card/Card.js'
import { MemoryStorage } from '../storage/storages/MemoryStorage.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { Storable } from '../storage/Storable.js'
import { precondition } from '../lib/preconditions.js'

export class CardRepository {
    static CARD_TABLE = 'cards'

    #dataStore

    constructor(dataStore) {
        this.#dataStore = dataStore
    }

    /**
     * @param {object} dto 
     * @returns {Id}
     */
    storeCard(dto) {
        precondition(CardMapper.isDtoValid(dto))
        const card = new Storable(CardRepository.CARD_TABLE, dto)
        return this.#dataStore.create(card)
    }

    /** 
     * @param {Id} id
     * @returns {boolean}
     * */
    deleteCard(id) {
        precondition(Boolean(id))
        const storable = new Storable(CardRepository.CARD_TABLE).setId(id)
        return this.#dataStore.delete(storable)
    }

    /** 
     * @param {Id} id
     * @returns {Card}
     */
    retrieveCard(id) {
        precondition(Boolean(id))
        const storable = new Storable(CardRepository.CARD_TABLE).setId(id)
        const result = this.#dataStore.read(storable)
        if (!result || !CardMapper.isDtoValid(result.getDto())) {
            return null
        }
        return CardMapper.fromDto(result.getDto())
    }

    /**
     * @param {Id} id 
     * @param {object} dto 
     * @returns {boolean}
     */
    updateCard(id, dto) {
        precondition(Boolean(id) && CardMapper.isDtoValid(dto))
        const storable = new Storable(CardRepository.CARD_TABLE, dto, id)
        return this.#dataStore.update(storable)
    }

}
