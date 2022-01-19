import {Card} from './Card.js'
import {Labelling} from './Labelling.js'
import {Identification} from '../shared/value/Identification.js'
import {CardDao} from './CardDao'
import {AuthorIdentification} from './AuthorIdentification'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory'

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
        try {
            return this.dao.findById(id)
        } catch(error) {
            return error
        }
    }

    async update(entity: Card) {
        try {
            await this.dao.update(entity)
        } catch (error) {
            return error
        }
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        return this.dao.findByLabelling(labelling)
    }

    async findByAuthorId(authorId: Identification): Promise<Card[]> {
        return this.dao.findByAuthorId(authorId as AuthorIdentification)
    }

}
