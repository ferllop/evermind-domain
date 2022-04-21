import {Card} from './Card.js'
import {Labelling} from './Labelling.js'
import {CardDao} from './CardDao.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory.js'
import {DeleteCard} from '../authorization/permission/permissions/DeleteCard.js'
import {CardIdentification} from './CardIdentification.js'
import {GetCard} from '../authorization/permission/permissions/GetCard.js'
import {Authorization} from '../authorization/Authorization.js'

export class CardRepository {

    protected dao: CardDao

    constructor(private authorization: Authorization) {
        this.dao = PersistenceFactory.getCardDao(authorization)
    }

    async add(card: Card) {
        return await this.dao.insert(card)
    }

    async delete(card: Card) {
        this.authorization.assertCan(DeleteCard, card)
        await this.dao.delete(card.getId())
    }

    async findById(cardId: CardIdentification): Promise<Card> {
        return this.dao.findById(cardId)
    }

    async getById(cardId: CardIdentification): Promise<Card> {
        const card = await this.dao.findById(cardId)
        this.authorization.assertCan(GetCard, card)
        return card
    }

    async update(card: Card) {
        return this.dao.update(card)
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        const cards = await this.dao.findByLabelling(labelling)
        return cards.filter(card => !card.isNull())
    }

    async findByAuthorId(authorId: AuthorIdentification): Promise<Card[]> {
        const cards = await this.dao.findByAuthorId(authorId)
        return cards.filter(card => !card.isNull())
    }

}
