import {Card} from './Card.js'
import {CardDto} from './CardDto.js'
import {CardField} from './CardField.js'
import {Labelling} from './Labelling.js'
import {Identification} from '../shared/value/Identification.js'
import {CardMapper} from './CardMapper.js'
import {NullCard} from './NullCard.js'
import {DomainError} from "../errors/DomainError";
import {ErrorType} from "../errors/ErrorType";
import {Criteria} from "../shared/Criteria";
import {Mapper} from "../shared/Mapper";
import {Datastore} from "../shared/Datastore";
import {ImplementationsContainer} from "../../implementations/implementations-container/ImplementationsContainer";
import {Dependency} from "../../implementations/implementations-container/Dependency";

export class CardRepository {

    protected readonly tableName: string
    protected mapper: Mapper<Card, CardDto>
    protected datastore: Datastore

    constructor() {
        this.tableName = CardField.TABLE_NAME
        this.mapper = new CardMapper()
        this.datastore = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    }

    async add(entity: Card) {
        const result = await this.datastore.create(this.tableName, this.mapper.toDto(entity))
        if (!result) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
    }

    async delete(card: Card) {
        if (card.isNull()) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const deleted = await this.datastore.delete(this.tableName, card.getId().getId())
        if (!deleted) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

    }

    async findById(id: Identification): Promise<Card> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const result = await this.datastore.read<CardDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return this.getNull()
        }

        return this.mapper.fromDto(result)
    }

    async update(entity: Card) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        const updated = this.datastore.update(this.tableName, this.mapper.toDto(entity))
        if(!updated) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
    }

    async find(criteria: Criteria<CardDto>): Promise<Card[]> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return []
        }
        const result = await this.datastore.findMany(this.tableName, criteria)
        return result.map(dto => this.mapper.fromDto(dto))
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
