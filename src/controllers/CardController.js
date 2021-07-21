import '../models/card/CardDto.js'
import { Card } from '../models/card/Card.js'
import { MemoryStorage } from '../storage/storages/MemoryStorage.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { Storable } from '../storage/Storable.js'
import { precondition } from '../lib/preconditions.js'

export class CardController {
    static CARD_TABLE = 'cards'

    /**
     * @param {object} dto 
     * @returns {Id}
     */
    storeCard(dto) {
        precondition(CardMapper.isDtoValid(dto))
        const card = new Storable(CardController.CARD_TABLE, dto)
        return MemoryStorage.getInstance().create(card)
    }

    /** 
     * @param {Id} id
     * @returns {boolean}
     * */
    deleteCard(id) {
        precondition(Boolean(id))
        const storable = new Storable(CardController.CARD_TABLE).setId(id)
        return MemoryStorage.getInstance().delete(storable)
    }

    /** 
     * @param {Id} id
     * @returns {Card}
     */
    retrieveCard(id) {
        precondition(Boolean(id))
        const storable = new Storable(CardController.CARD_TABLE).setId(id)
        const result = MemoryStorage.getInstance().read(storable)
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
        const storable = new Storable(CardController.CARD_TABLE, dto, id)
        return MemoryStorage.getInstance().update(storable)
    }

}
