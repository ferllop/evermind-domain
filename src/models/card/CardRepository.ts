import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../Datastore.js'
import { Labelling } from '../../models/card/Labelling.js'
import { CardField } from '../../models/card/CardField.js'
import { Repository } from '../Repository.js'
import { CardMapper } from './CardMapper.js'
import { NullCard } from './NullCard.js'

export class CardRepository extends Repository<Card, CardDto> {

    constructor(datastore: Datastore) {
        super(CardField.TABLE_NAME, new CardMapper(), datastore)
    }

    findByLabelling(labelling: Labelling): Card[] {
        if (!this.datastore.hasTable(CardField.TABLE_NAME)) {
            return []
        }

        const result = this.datastore.find<CardDto>(CardField.TABLE_NAME, 
            (cardDto: CardDto) => {
                const labelsInDto = Labelling.fromStringLabels(cardDto.labelling)
                return labelling.isIncluded(labelsInDto)
            })
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

    findById(id: Identification): Card {
        if (!this.datastore.hasTable(CardField.TABLE_NAME)) {
            return this.getNull()
        }
        const card = this.datastore.read<CardDto>(CardField.TABLE_NAME, id.getId())
        return card ? new CardMapper().fromDto(card) : this.getNull()
    } 


    getNull() {
        return NullCard.getInstance()
    }
}
