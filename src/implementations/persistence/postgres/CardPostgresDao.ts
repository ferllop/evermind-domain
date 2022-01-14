import {PostgresDatastore, PostgresErrorType} from './PostgresDatastore'
import {DomainError} from '../../../domain/errors/DomainError'
import {ErrorType} from '../../../domain/errors/ErrorType'
import {AuthorIdentification} from '../../../domain/card/AuthorIdentification'
import {Card} from '../../../domain/card/Card'
import {CardIdentification} from '../../../domain/card/CardIdentification'
import {CardMapper} from '../../../domain/card/CardMapper'
import {CardSqlQuery} from './CardSqlQuery'
import {NullCard} from "../../../domain/card/NullCard";
import {CardDao} from "../../../domain/card/CardDao";
import {Labelling} from "../../../domain/card/Labelling";
import {CardDto} from "../../../domain/card/CardDto";

export class CardPostgresDao implements CardDao {

    private sqlQuery = new CardSqlQuery()

    constructor(private datastore: PostgresDatastore = new PostgresDatastore()) {
    }

    async insert(card: Card) {
        const query = this.sqlQuery.insert(card)

        try {
            await this.datastore.query(query)
        } catch (error) {
            if (error.code === PostgresErrorType.NOT_UNIQUE_FIELD) {
                throw new DomainError(ErrorType.CARD_ALREADY_EXISTS)
            }
            throw error
        }

    }

    async update(card: Card) {
        const query = this.sqlQuery.update(card)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
    }

    async delete(id: CardIdentification) {
        const query = this.sqlQuery.delete(id)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
    }

    async findByAuthorId(id: AuthorIdentification): Promise<Card[]> {
        const query = this.sqlQuery.selectCardByAuthorId(id)
        const result = await this.datastore.query(query)
        return new CardMapper().fromDtoArray(result.rows)
    }

    async findById(id: CardIdentification): Promise<Card> {
        const query = this.sqlQuery.selectCardById(id)
        const result = await this.datastore.query(query)
        if (result.rowCount > 1) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
        return result.rowCount === 1 ? new CardMapper().fromDto(result.rows[0]) : NullCard.getInstance()
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        const query = this.sqlQuery.selectCardByLabelling(labelling)
        const result = await this.datastore.query(query)
        return result.rows.map(this.fromRowToCard)
    }

    private fromRowToCard(row: CardRow): Card {
        const pgCardMap: Record<string, keyof CardDto> = {
            id: 'id',
            author_id: 'authorID',
            question: 'question',
            answer: 'answer',
            labelling: 'labelling',
        }
        const cardDto = Object.keys(row).reduce( (accum, key) => {
            const value = row[key as keyof CardRow]
            return { ...accum,
                [pgCardMap[key]]: value}

        }, {})

        return new CardMapper().fromDto(cardDto as CardDto)
    }

}

export type CardRow = {
    id: string,
    author_id: string,
    question: string,
    answer: string,
    labelling: string[],
}

