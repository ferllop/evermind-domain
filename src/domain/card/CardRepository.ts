import {Card} from './Card.js'
import {Labelling} from './Labelling.js'
import {Identification} from '../shared/value/Identification.js'
import {CardDao} from './CardDao.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory.js'

export class CardRepository {

    protected dao: CardDao

    constructor() {
        this.dao = PersistenceFactory.getCardDao()
    }

    async add(card: Card) {
        await this.dao.insert(card)
    }

    async delete(card: Card) {
        await this.dao.delete(card.getId())
    }

    async findById(id: Identification): Promise<Card> {
        return this.dao.findById(id)
    }

    async update(entity: Card) {
        return this.dao.update(entity)
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        return this.dao.findByLabelling(labelling)
    }

    async findByAuthorId(authorId: Identification): Promise<Card[]> {
        return this.dao.findByAuthorId(authorId as AuthorIdentification)
    }

}
