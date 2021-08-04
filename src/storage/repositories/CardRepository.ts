import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { CardMapper } from '../storables/CardMapper.js'
import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'
import { Labelling } from '../../models/card/Labelling.js'

export class CardRepository {
    static TABLE_NAME = 'cards'

    private dataStore: Datastore

    constructor(dataStore: Datastore) {
        this.dataStore = dataStore
    }

    storeCard(card: Card): boolean {
        return this.dataStore.create(CardRepository.TABLE_NAME, CardMapper.toDto(card))
    }

    deleteCard(id: Identification): boolean {
        if (! this.dataStore.hasTable(CardRepository.TABLE_NAME)) {
            return false
        }
        return this.dataStore.delete(CardRepository.TABLE_NAME, id.toString())
    }

    retrieveCard(id: Identification): Card | null {
        if (!this.dataStore.hasTable(CardRepository.TABLE_NAME)) {
            return null
        }
        const result = this.dataStore.read<CardDto>(CardRepository.TABLE_NAME, id.toString())
        if (!result || !CardMapper.isDtoValid(result)) {
            return null
        }
        return CardMapper.fromDto(result)
    }

    updateCard(card: Card): boolean {
        if (!this.dataStore.hasTable(CardRepository.TABLE_NAME)) {
            return false
        }
        return this.dataStore.update(CardRepository.TABLE_NAME, CardMapper.toDto(card))
    }

    findByLabels(labels: string[]): Card[] {
        if (!this.dataStore.hasTable(CardRepository.TABLE_NAME)) {
            return []
        }

        const result = this.dataStore.find<CardDto>(CardRepository.TABLE_NAME, (cardDto: CardDto) => new Labelling(labels).includesAllLabels(cardDto.labelling))
        return CardMapper.fromDtoArray(result)
    }

    findByAuthorId(authorId: Identification): Card[] {
        if (!this.dataStore.hasTable(CardRepository.TABLE_NAME)) {
            return []
        }

        const result = this.dataStore.find<CardDto>(CardRepository.TABLE_NAME, (card: CardDto) => {
            return authorId.equals(card.authorID)
        }) 

        return CardMapper.fromDtoArray(result)
    }
}
