import {DomainError} from '../../../../domain/errors/DomainError'
import {ErrorType} from '../../../../domain/errors/ErrorType'
import {AuthorIdentification} from '../../../../domain/card/AuthorIdentification'
import {Card} from '../../../../domain/card/Card'
import {CardIdentification} from '../../../../domain/card/CardIdentification'
import {CardSqlQuery} from './CardSqlQuery'
import {NullCard} from "../../../../domain/card/NullCard";
import {CardDao} from "../../../../domain/card/CardDao";
import {Labelling} from "../../../../domain/card/Labelling";
import {CardPostgresMapper} from "./CardPostgresMapper";
import {CardPostgresDatastore} from "./CardPostgresDatastore";
import {PostgresErrorType} from '../PostgresErrorType'

export class CardPostgresDao implements CardDao {

    private sqlQuery = new CardSqlQuery()

    constructor(private datastore: CardPostgresDatastore = new CardPostgresDatastore()) {
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
        return result.rows.map(new CardPostgresMapper().rowToCard)
    }

    async findById(id: CardIdentification): Promise<Card> {
        const query = this.sqlQuery.selectCardById(id)
        const result = await this.datastore.query(query)
        if (result.rowCount > 1) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
        return result.rowCount === 1 ? new CardPostgresMapper().rowToCard(result.rows[0]) : NullCard.getInstance()
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        const query = this.sqlQuery.selectCardByLabelling(labelling)
        const result = await this.datastore.query(query)
        return result.rows.map(new CardPostgresMapper().rowToCard)
    }
}


