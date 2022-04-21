import {AuthorIdentification} from '../../../../domain/card/AuthorIdentification.js'
import {Card} from '../../../../domain/card/Card.js'
import {CardIdentification} from '../../../../domain/card/CardIdentification.js'
import {CardSqlQuery} from './CardSqlQuery.js'
import {NullCard} from '../../../../domain/card/NullCard.js'
import {CardDao} from '../../../../domain/card/CardDao.js'
import {Labelling} from '../../../../domain/card/Labelling.js'
import {CardPostgresMapper} from './CardPostgresMapper.js'
import {CardPostgresDatastore} from './CardPostgresDatastore.js'
import {PostgresErrorType} from '../PostgresErrorType.js'
import {PostgresDatastoreError} from '../PostgresDatastoreError.js'
import {CardAlreadyExistsError} from '../../../../domain/errors/CardAlreadyExistsError.js'
import {CardNotFoundError} from '../../../../domain/errors/CardNotFoundError.js'
import {DataFromStorageNotValidError} from '../../../../domain/errors/DataFromStorageNotValidError.js'
import {Authorization} from '../../../../domain/authorization/Authorization.js'
import {StoredCard} from '../../../../domain/card/StoredCard.js'

export class CardPostgresDao implements CardDao {

    private sqlQuery = new CardSqlQuery()

    constructor(private authorization: Authorization,
                private datastore: CardPostgresDatastore = new CardPostgresDatastore()) {
    }

    async insert(card: Card) {
        const entity = new StoredCard(card, CardIdentification.create())
        const query = this.sqlQuery.insert(entity)

        try {
            await this.datastore.query(query)
            return entity
        } catch (error) {
            if (error instanceof PostgresDatastoreError && error.code === PostgresErrorType.NOT_UNIQUE_FIELD) {
                throw new CardAlreadyExistsError()
            }
            throw error
        }
    }

    async update(card: Card) {
        const query = this.sqlQuery.update(card)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new CardNotFoundError()
        }
    }

    async delete(id: CardIdentification) {
        const query = this.sqlQuery.delete(id)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new CardNotFoundError()
        }
    }

    async findByAuthorId(id: AuthorIdentification): Promise<Card[]> {
        const query = this.sqlQuery.selectCardByAuthorId(id)
        const result = await this.datastore.query(query)
        return result.rows.map(new CardPostgresMapper(this.authorization).rowToCard)
    }

    async findById(id: CardIdentification): Promise<Card> {
        const query = this.sqlQuery.selectCardById(id)
        const result = await this.datastore.query(query)
        if (result.rowCount > 1) {
            throw new DataFromStorageNotValidError()
        }
        return result.rowCount === 1 ? new CardPostgresMapper(this.authorization).rowToCard(result.rows[0]) : NullCard.getInstance()
    }

    async findByLabelling(labelling: Labelling): Promise<Card[]> {
        const query = this.sqlQuery.selectCardByLabelling(labelling)
        const result = await this.datastore.query(query)
        return result.rows.map(new CardPostgresMapper(this.authorization).rowToCard)
    }
}


