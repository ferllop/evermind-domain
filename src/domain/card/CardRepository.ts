import {Card} from './Card.js'
import {CardDto} from './CardDto.js'
import {CardField} from './CardField.js'
import {Labelling} from './Labelling.js'
import {Identification} from '../shared/value/Identification.js'
import {CardMapper} from './CardMapper.js'
import {NullCard} from './NullCard.js'
import {Repository} from '../shared/Repository.js'

export class CardRepository extends Repository<Card, CardDto> {

    constructor() {
        super(CardField.TABLE_NAME, new CardMapper())
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        const criteria = (cardDto: CardDto) => {
            const labelsInDto = Labelling.fromStringLabels(cardDto.labelling)
            return labelling.isIncluded(labelsInDto)
        }
        return this.find(criteria)
    }

    async findByAuthorId(authorId: Identification): Promise<Card[]> {
        const criteria = (card: CardDto) => {
            return authorId.equals(new Identification(card.authorID))
        }
        return this.find(criteria)
    }

    getNull() {
        return NullCard.getInstance()
    }
}
