import {Card} from './Card.js'
import {Labelling} from './Labelling.js'
import {Identification} from '../shared/value/Identification.js'
import {CardInMemoryDao} from "../../implementations/persistence/in-memory/CardInMemoryDao";
import {CardDao} from "./CardDao";
import {AuthorIdentification} from "./AuthorIdentification";

export class CardRepository {

    protected dao: CardDao

    constructor() {
        this.dao = new CardInMemoryDao()
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
