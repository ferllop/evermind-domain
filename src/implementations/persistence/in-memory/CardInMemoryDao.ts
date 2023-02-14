import {CardDao} from '../../../domain/card/CardDao.js'
import {NullCard} from '../../../domain/card/NullCard.js'
import {Identification} from '../../../domain/shared/value/Identification.js'
import {InMemoryDatastore} from './InMemoryDatastore.js'
import {Card} from '../../../domain/card/Card.js'
import {CardIdentification} from '../../../domain/card/CardIdentification.js'
import {CardDto} from '../../../types/dtos/CardDto.js'
import {AuthorIdentification} from '../../../domain/card/AuthorIdentification.js'
import {Labelling} from '../../../domain/card/Labelling.js'
import {Criteria} from './Criteria.js'
import {DataFromStorageNotValidError} from '../../../domain/errors/DataFromStorageNotValidError.js'
import {CardNotFoundError} from '../../../domain/errors/CardNotFoundError.js'
import {CardFactory} from '../../../domain/card/CardFactory.js'
import {Authorization} from '../../../domain/authorization/Authorization.js'
import {StoredCard} from '../../../domain/card/StoredCard.js'

export class CardInMemoryDao implements CardDao {
    private readonly tableName = 'cards'

    constructor(
        private authorization: Authorization,
        protected datastore: InMemoryDatastore = new InMemoryDatastore(),
    ){}

    async insert(card: Card) {
        const entity = new StoredCard(card, CardIdentification.create())
        const result = await this.datastore.create(this.tableName, entity.toDto())
        if (!result) {
            throw new DataFromStorageNotValidError()
        }
        return entity
    }

    async delete(id: CardIdentification) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new CardNotFoundError()
        }
        const deleted = await this.datastore.delete(this.tableName, id.getValue())
        if (!deleted) {
            throw new CardNotFoundError()
        }

    }

    async findById(id: CardIdentification): Promise<Card> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }
        const result = await this.datastore.read<CardDto>(this.tableName, id.getValue())
        const cardFactory = new CardFactory(this.authorization)
        if (!result || !cardFactory.isDtoValid(result)) {
            return this.getNull()
        }

        return cardFactory.fromDto(result)
    }

    async update(card: Card) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new CardNotFoundError()
        }
        const updated = this.datastore.update(this.tableName, card.toDto())
        if(!updated) {
            throw new CardNotFoundError()
        }
    }

    async findByAuthorId(authorId: AuthorIdentification): Promise<Card[]> {
        const criteria = (card: CardDto) => {
            return authorId.equals(new Identification(card.authorId))
        }
        return this.find(criteria)
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        const criteria = (cardDto: CardDto) => {
            const labelsInDto = Labelling.fromStringLabels(cardDto.labelling)
            return labelling.isIncluded(labelsInDto)
        }
        return this.find(criteria)
    }

    private async find(criteria: Criteria<CardDto>): Promise<Card[]> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return []
        }
        const result = await this.datastore.findMany(this.tableName, criteria)
        return new CardFactory(this.authorization).recreateFromDtos(result)
    }

    getNull() {
        return NullCard.getInstance()
    }

}