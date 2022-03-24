import {Card} from './Card.js'
import {Labelling} from './Labelling.js'
import {Identification} from '../shared/value/Identification.js'
import {CardDao} from './CardDao.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory.js'
import {Authorization} from '../authorization/Authorization.js'
import {DeleteCard} from '../authorization/permission/permissions/DeleteCard.js'
import {UserPermissions} from '../authorization/UserPermissions.js'

export class CardRepository {

    protected dao: CardDao

    constructor() {
        this.dao = PersistenceFactory.getCardDao()
    }

    async add(card: Card) {
        await this.dao.insert(card)
    }

    async delete(card: Card, userPermissions: UserPermissions) {
        Authorization.assertUserWithPermissions(userPermissions).can(DeleteCard, card)
        await this.dao.delete(card.getId())
    }

    async findById(id: Identification): Promise<Card> {
        return this.dao.findById(id)
    }

    async update(card: Card) {
        return this.dao.update(card)
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        return this.dao.findByLabelling(labelling)
    }

    async findByAuthorId(authorId: Identification): Promise<Card[]> {
        return this.dao.findByAuthorId(authorId as AuthorIdentification)
    }

}
