import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { CardMapper } from '../storables/CardMapper.js'
import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'
import { Labelling } from '../../models/card/Labelling.js'
import { CardField } from '../../models/card/CardField.js'

export class CardRepository {

    private datastore: Datastore

    constructor(dataStore: Datastore) {
        this.datastore = dataStore
    }

    findByLabels(labels: string[]): Card[] {
        if (!this.datastore.hasTable(CardField.TABLE_NAME)) {
            return []
        }

        const result = this.datastore.find<CardDto>(CardField.TABLE_NAME, (cardDto: CardDto) => new Labelling(labels).includesAllLabels(cardDto.labelling))
        return new CardMapper().fromDtoArray(result)
    }

    findByAuthorId(authorId: Identification): Card[] {
        if (!this.datastore.hasTable(CardField.TABLE_NAME)) {
            return []
        }

        const result = this.datastore.find<CardDto>(CardField.TABLE_NAME, (card: CardDto) => {
            return authorId.equals(new Identification(card.authorID))
        }) 

        return new CardMapper().fromDtoArray(result)
    }

    findById(id: Identification): Card | null {
        if (!this.datastore.hasTable(CardField.TABLE_NAME)) {
            return null
        }
        const card = this.datastore.read<CardDto>(CardField.TABLE_NAME, id.getId())
        return card && new CardMapper().fromDto(card)
    } 
}
