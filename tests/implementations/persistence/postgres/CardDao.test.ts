import { QueryResult } from 'node-postgres'
import { AuthorIdentification } from '../../../../src/domain/card/AuthorIdentification.js'
import { CardIdentification } from '../../../../src/domain/card/CardIdentification.js'
import { CardDao } from '../../../../src/domain/card/CardDao.js'
import { DomainError } from '../../../../src/domain/errors/DomainError.js'
import { ErrorType } from '../../../../src/domain/errors/ErrorType.js'
import { PostgresDatastore } from '../../../../src/implementations/persistence/postgres/PostgresDatastore.js'
import { CardBuilder } from '../../../domain/card/CardBuilder.js'
import { assert, suite } from '../../../test-config.js'
import { Card } from '../../../../src/domain/card/Card.js'
import { CardMapper } from '../../../../src/domain/card/CardMapper.js'

const cardDao = suite('Card DAO')

cardDao('should throw a CARD_ALREADY_EXISTS error when the provided card already exists', async () => {
    const mock = new PostgresDatastoreMock()
    mock.throwError({code: '23505'})
    const sut = new CardDao(mock)
    const id = CardIdentification.create().getId()
    const card = new CardBuilder().withId(id).build()
    try {
        await sut.add(card)
        assert.unreachable()
    } catch (error) {
        if(error instanceof DomainError){
            assert.is(error.getCode(), ErrorType.CARD_ALREADY_EXISTS)
        } else {
            throw error
        }
    }
})

cardDao('should send the correct insert query to datastore', async () => {
    const card = new CardBuilder().withLabels(['label1','label2']).build()
    const mock = new PostgresDatastoreMock()
    const sut = new CardDao(mock)
    const {id, authorID, question, answer} = card.toDto()
    const query = `BEGIN;
    INSERT INTO cards(
        id, 
        author_id, 
        question, 
        answer
        ) VALUES (
        '${id}',
        '${authorID}',
        '${question}',
        '${answer}');
    INSERT INTO card_label 
    VALUES 
        ('${card.getId().getId()}','label1'),('${
        card.getId().getId()}','label2');
    COMMIT;`
    mock.expectQuery(query)
    await sut.add(card)
})

cardDao('should throw a CARD_NOT_FOUND error when no card is found to be deleted', async () => {
    const mock = new PostgresDatastoreMock()
    const repo = new CardDao(mock)
    const deletedCards = 0
    mock.returnResult(new QueryResultBuilder().withRowCount(deletedCards).build())

    try {
        const card = new CardBuilder().build()
        await repo.delete(card.getId())
        assert.unreachable()
    } catch(error) {
        if(error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.CARD_NOT_FOUND)
        } else {
            throw error
        }
    }
})

cardDao('should send the correct query to delete the provided card', async () => {
    const mock = new PostgresDatastoreMock()
    const sut = new CardDao(mock)
    const id = CardIdentification.create()
    mock.expectQuery(`DELETE FROM cards WHERE id = '${id.getId()}'`)
    mock.returnResult(new QueryResultBuilder().withRowCount(1).build())
    await sut.delete(id)
})

cardDao('should throw a CARD_NOT_FOUND error when no card is found to be updated', async () => {
    const mock = new PostgresDatastoreMock()
    const sut = new CardDao(mock)
    mock.returnResult(new QueryResultBuilder().withRowCount(0).build())
    const card = new CardBuilder().build()
    try {
        await sut.update(card)
        assert.unreachable()
    } catch(error) {
        if (error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.CARD_NOT_FOUND)
        } else {
            throw error
        }
    }
})

cardDao('shoùld send the proper card update query to the sql datastore', async () => {
    const mock = new PostgresDatastoreMock()
    const sut = new CardDao(mock)
    const card = new CardBuilder().build()
    mock.returnResult(new QueryResultBuilder().withRowCount(1).build())
    mock.expectQuery(`BEGIN;
        UPDATE cards SET
        question = '${card.getQuestion().getValue()}',
        answer = '${card.getAnswer().getValue()}'
        WHERE id = '${card.getId().getId()}';
        DELETE FROM card_label WHERE card_id = '${card.getId().getId()}';
        INSERT INTO card_label VALUES ('${card.getId().getId()}','${card.getLabelling().getLabels()[0]}');
        COMMIT;`)
    await sut.update(card)
})

cardDao('should send the proper query to find a card by it\'s author', async () => {
    const mock = new PostgresDatastoreMock()
    const sut = new CardDao(mock)
    const authorId = AuthorIdentification.create()
    mock.expectQuery(`SELECT id, author_id, question, answer 
        FROM cards 
        WHERE author_id = '${authorId.getId()}'`)
    await sut.findByAuthorId(authorId)
})

cardDao('should return the found cards', async () => {
    const mock = new PostgresDatastoreMock()
    const sut = new CardDao(mock)
    const authorId = AuthorIdentification.create()
    const cards: Card[] = [
       new CardBuilder().withAuthorId(authorId.getId()).build() 
    ]
    const queryResult = new QueryResultBuilder().withRows(cards.map(card => new CardMapper().toDto(card))).withRowCount(1).build()
    mock.returnResult(queryResult)
    const result = await sut.findByAuthorId(AuthorIdentification.create())
    assertCardsAreEquals(result, cards)
})

cardDao.run()

function assertCardsAreEquals(actual: Card[], expect: Card[]){
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
            return this.errorToThrow
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

    private assertMultiLine(actual :string, expect: string) {
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


