import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { CardMapper } from '../storables/CardMapper.js'
import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'
import { Labelling } from '../../models/card/Labelling.js'
import { CardField } from '../../models/card/CardField.js'
import { Identified } from '../datastores/Identified.js'

export class CardRepository {

    private dataStore: Datastore

    constructor(dataStore: Datastore) {
        this.dataStore = dataStore
    }

    findByLabels(labels: string[]): Card[] {
        if (!this.dataStore.hasTable(CardField.TABLE_NAME)) {
            return []
        }

        const result = this.dataStore.find<Identified<CardDto>>(CardField.TABLE_NAME, (cardDto: CardDto) => new Labelling(labels).includesAllLabels(cardDto.labelling))
        return new CardMapper().fromDtoArray(result)
    }

    findByAuthorId(authorId: Identification): Card[] {
        if (!this.dataStore.hasTable(CardField.TABLE_NAME)) {
            return []
        }

        const result = this.dataStore.find<Identified<CardDto>>(CardField.TABLE_NAME, (card: CardDto) => {
            return authorId.equals(card.authorID)
        }) 

        return new CardMapper().fromDtoArray(result)
    }
}
