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
        const criteria = (cardDto: CardDto) => {
            const labelsInDto = Labelling.fromStringLabels(cardDto.labelling)
            return labelling.isIncluded(labelsInDto)
        }
        return this.find(criteria)
    }

    findByAuthorId(authorId: Identification): Card[] {
        const criteria = (card: CardDto) => {
            return authorId.equals(new Identification(card.authorID))
        }
        return this.find(criteria)
    }

    getNull() {
        return NullCard.getInstance()
    }
}
