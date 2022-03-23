import {Card} from './Card.js'
import {Labelling} from './Labelling.js'
import {Identification} from '../shared/value/Identification.js'
import {CardDao} from './CardDao.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {PersistenceFactory} from '../../implementations/persistence/PersistenceFactory.js'
import {Authorization} from '../authorization/Authorization.js'
import {RequesterIdentification} from '../authorization/permission/RequesterIdentification.js'
import {CreateCard} from '../authorization/permission/permissions/CreateCard.js'
import {DeleteCard} from '../authorization/permission/permissions/DeleteCard.js'
import {UpdateCard} from '../authorization/permission/permissions/UpdateCard.js'
import {TransferCard} from '../authorization/permission/permissions/TransferCard.js'
import {User} from '../user/User.js'

export class CardRepository {

    protected dao: CardDao

    constructor() {
        this.dao = PersistenceFactory.getCardDao()
    }

    async add(card: Card, requesterId: RequesterIdentification) {
        await Authorization.assert(requesterId).can(CreateCard, card)
        await this.dao.insert(card)
    }

    async delete(card: Card, requesterId: RequesterIdentification) {
        await Authorization.assert(requesterId).can(DeleteCard, card)
        await this.dao.delete(card.getId())
    }

    async findById(id: Identification): Promise<Card> {
        return this.dao.findById(id)
    }

    async updateData(card: Card, requesterId: RequesterIdentification) {
        await Authorization.assert(requesterId).can(UpdateCard, card)
        return this.dao.update(card)
    }

    async transfer(card: Card, user: User, requesterId: RequesterIdentification) {
        const transferredCard = card.transferTo(user)
        await Authorization.assert(requesterId).can(TransferCard, card)
        return this.dao.update(transferredCard)
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        return this.dao.findByLabelling(labelling)
    }

    async findByAuthorId(authorId: Identification): Promise<Card[]> {
        return this.dao.findByAuthorId(authorId as AuthorIdentification)
    }

}
