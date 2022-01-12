import {CardDao} from "../../../domain/card/CardDao";
import {NullCard} from "../../../domain/card/NullCard";
import {CardMapper} from "../../../domain/card/CardMapper";
import {DomainError} from "../../../domain/errors/DomainError";
import {ErrorType} from "../../../domain/errors/ErrorType";
import {Identification} from "../../../domain/shared/value/Identification";
import {InMemoryDatastore} from "./InMemoryDatastore";
import {Card} from "../../../domain/card/Card";
import {CardIdentification} from "../../../domain/card/CardIdentification";
import {CardDto} from "../../../domain/card/CardDto";
import {AuthorIdentification} from "../../../domain/card/AuthorIdentification";
import {ImplementationsContainer} from "../../implementations-container/ImplementationsContainer";
import {Dependency} from "../../implementations-container/Dependency";
import {Labelling} from "../../../domain/card/Labelling";
import {Criteria} from "../../../domain/shared/Criteria";

export class CardInMemoryDao implements CardDao {
    private readonly tableName = 'cards'
    private mapper = new CardMapper()
    protected datastore: InMemoryDatastore

    constructor(){
        this.datastore = ImplementationsContainer.get(Dependency.DATASTORE) as InMemoryDatastore
    }

    async insert(card: Card) {
        const result = await this.datastore.create(this.tableName, card.toDto())
        if (!result) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
    }

    async delete(id: CardIdentification) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
        const deleted = await this.datastore.delete(this.tableName, id.getId())
        if (!deleted) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

    }

    async findById(id: CardIdentification): Promise<Card> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }
        const result = await this.datastore.read<CardDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return this.getNull()
        }

        return this.mapper.fromDto(result)
    }

    async update(card: Card) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
        const updated = this.datastore.update(this.tableName, card.toDto())
        if(!updated) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
    }

    async findByAuthorId(authorId: AuthorIdentification): Promise<Card[]> {
        const criteria = (card: CardDto) => {
            return authorId.equals(new Identification(card.authorID))
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
        return result.map(dto => this.mapper.fromDto(dto))
    }

    getNull() {
        return NullCard.getInstance()
    }

}