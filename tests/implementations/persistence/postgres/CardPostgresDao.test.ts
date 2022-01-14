import {QueryResult} from 'node-postgres'
import {AuthorIdentification} from '../../../../src/domain/card/AuthorIdentification.js'
import {CardIdentification} from '../../../../src/domain/card/CardIdentification.js'
import {CardPostgresDao} from '../../../../src/implementations/persistence/postgres/CardPostgresDao.js'
import {DomainError} from '../../../../src/domain/errors/DomainError.js'
import {ErrorType} from '../../../../src/domain/errors/ErrorType.js'
import {PostgresDatastore} from '../../../../src/implementations/persistence/postgres/PostgresDatastore.js'
import {CardBuilder} from '../../../domain/card/CardBuilder.js'
import {assert, suite} from '../../../test-config.js'
import {Card} from '../../../../src/domain/card/Card.js'
import {CardMapper} from '../../../../src/domain/card/CardMapper.js'
import {givenTheExistingCardWithLabels} from "./CardSqlQuery.test";
import {Labelling} from "../../../../src/domain/card/Labelling";
import {UserSqlQuery} from "../../../../src/implementations/persistence/postgres/UserSqlQuery";
import {CardSqlQuery} from "../../../../src/implementations/persistence/postgres/CardSqlQuery";

const cardDao = suite('Card DAO')

cardDao.before.each(async () => {
    const postgresDatastore = new PostgresDatastore()
    try {
        await postgresDatastore.query('DROP TABLE IF EXISTS cards CASCADE; DROP TABLE IF EXISTS labelling; DROP TABLE IF EXISTS users;' +
            new UserSqlQuery().createUsersTable() + ';' +
            new CardSqlQuery().createCardsTable() + ';' +
            new CardSqlQuery().createLabellingTable())
    } catch (error) {
        console.log('ERROR:', error)
    }
})

cardDao('should throw a CARD_ALREADY_EXISTS error when the provided card already exists', async () => {
    const mock = new PostgresDatastoreMock()
    mock.throwError({code: '23505'})
    const sut = new CardPostgresDao(mock)
    const id = CardIdentification.create().getId()
    const card = new CardBuilder().withId(id).build()
    try {
        await sut.insert(card)
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.CARD_ALREADY_EXISTS)
        } else {
            throw error
        }
    }
})

cardDao('should throw a CARD_NOT_FOUND error when no card is found to be deleted', async () => {
    const mock = new PostgresDatastoreMock()
    const repo = new CardPostgresDao(mock)
    const deletedCards = 0
    mock.returnResult(new QueryResultBuilder().withRowCount(deletedCards).build())

    try {
        const card = new CardBuilder().build()
        await repo.delete(card.getId())
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.CARD_NOT_FOUND)
        } else {
            throw error
        }
    }
})

cardDao('should throw a CARD_NOT_FOUND error when no card is found to be updated', async () => {
    const mock = new PostgresDatastoreMock()
    const sut = new CardPostgresDao(mock)
    mock.returnResult(new QueryResultBuilder().withRowCount(0).build())
    const card = new CardBuilder().build()
    try {
        await sut.update(card)
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.CARD_NOT_FOUND)
        } else {
            throw error
        }
    }
})

cardDao('should return the found cards when searching by author id', async () => {
    const mock = new PostgresDatastoreMock()
    const sut = new CardPostgresDao(mock)
    const authorId = AuthorIdentification.create()
    const cards: Card[] = [
        new CardBuilder().withAuthorId(authorId.getId()).build()
    ]
    const queryResult = new QueryResultBuilder().withRows(cards.map(card => new CardMapper().toDto(card))).withRowCount(1).build()
    mock.returnResult(queryResult)
    const result = await sut.findByAuthorId(AuthorIdentification.create())
    assertCardsAreEqualsInStrictOrder(result, cards)
})

cardDao('should return the found cards when searching by labelling', async () => {
    const cardToBeFoundA = await givenTheExistingCardWithLabels('label1', 'label2')
    const cardToBeFoundB = await givenTheExistingCardWithLabels('label1', 'label2', 'label3')
    await givenTheExistingCardWithLabels('label1')

    const sut = new CardPostgresDao()
    const result = await sut.findByLabelling(Labelling.fromStringLabels(['label1', 'label2']))
    assertCardsAreEqualsInAnyOrder(result, [cardToBeFoundA, cardToBeFoundB]);
    //assertCardsAreEquals(result, [cardToBeFoundB, cardToBeFoundA])
})


cardDao.run()

export function assertCardsAreEqualsInAnyOrder(result: Card[], cards: Card[]) {
    assert.ok(
        result
            .map(found => JSON.stringify(found))
            .every(found => cards.map(card => JSON.stringify(card)).includes(found)))
}

export function assertCardsAreEqualsInStrictOrder(actual: Card[], expect: Card[]) {
    actual.forEach((card, i) => {
        assert.equal(card.getId().getId(), expect[i].getId().getId())
        assert.equal(card.getAuthorID(), expect[i].getAuthorID())
        assert.equal(card.getQuestion(), expect[i].getQuestion())
        assert.equal(card.getAnswer(), expect[i].getAnswer())
        assert.equal(card.getLabelling(), expect[i].getLabelling())
    })
}

type PostgresDatastoreError = {
    code: string
}

class PostgresDatastoreMock extends PostgresDatastore {
    private resultToReturn: QueryResult = new QueryResultBuilder().build()
    private expectedQuery: string = ''
    private errorToThrow: PostgresDatastoreError | null = null

    override async query(query: string) {
        if (this.errorToThrow) {
            throw this.errorToThrow
        }
        if (this.expectedQuery) {
            this.assertMultiLine(query, this.expectedQuery)
        }
        return this.resultToReturn
    }

    expectQuery(query: string) {
        this.expectedQuery = query
    }

    returnResult(result: QueryResult) {
        this.resultToReturn = result
    }

    throwError(error: PostgresDatastoreError) {
        this.errorToThrow = error
    }

    private removeIndent(str: string) {
        return str.replace(/\s+/g, ' ')
    }

    private assertMultiLine(actual: string, expect: string) {
        assert.equal(this.removeIndent(actual), this.removeIndent(expect))
    }
}

class QueryResultBuilder {
    private rows: any[] = []
    private command = ''
    private rowCount = 0
    private oid = 0
    private fields = []

    withRowCount(count: number) {
        this.rowCount = count
        return this
    }

    withRows(rows: any[]) {
        this.rows = rows
        return this
    }

    build() {
        return {
            rows: this.rows,
            command: this.command,
            rowCount: this.rowCount,
            oid: this.oid,
            fields: this.fields,
        }
    }
}


