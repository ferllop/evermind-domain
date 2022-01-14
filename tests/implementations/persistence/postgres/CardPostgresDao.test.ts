import {AuthorIdentification} from '../../../../src/domain/card/AuthorIdentification.js'
import {CardIdentification} from '../../../../src/domain/card/CardIdentification.js'
import {CardPostgresDao} from '../../../../src/implementations/persistence/postgres/CardPostgresDao.js'
import {DomainError} from '../../../../src/domain/errors/DomainError.js'
import {ErrorType} from '../../../../src/domain/errors/ErrorType.js'
import {PostgresErrorType} from '../../../../src/implementations/persistence/postgres/PostgresDatastore.js'
import {CardBuilder} from '../../../domain/card/CardBuilder.js'
import {assert, suite} from '../../../test-config.js'
import {Card} from '../../../../src/domain/card/Card.js'
import {Labelling} from "../../../../src/domain/card/Labelling";
import {QueryResultBuilder} from "./QueryResultBuilder";
import {PostgresDatastoreMock} from "./PostgresDatastoreMock";
import {CardPostgresMapperTestHelper} from "./CardPostgresMapperTestHelper";
import {assertCardsAreEqualsInAnyOrder} from "./CardAssertion";

type Context = {
    mock: PostgresDatastoreMock,
    sut: CardPostgresDao
}

const cardDao = suite<Context>('Card DAO')

cardDao.before.each(context => {
    context.mock = new PostgresDatastoreMock()
    context.sut = new CardPostgresDao(context.mock)
})

cardDao('should throw a CARD_ALREADY_EXISTS error when inserting a card that already exists', async ({mock, sut}) => {
    mock.throwError({code: PostgresErrorType.NOT_UNIQUE_FIELD})
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

cardDao('should throw a CARD_NOT_FOUND error when deleting a non-existing card', async ({mock, sut}) => {
    const deletedCardsCount = 0
    const noDeletedCardsResult = new QueryResultBuilder().withRowCount(deletedCardsCount).build()
    mock.returnResult(noDeletedCardsResult)
    try {
        await sut.delete(CardIdentification.create())
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.CARD_NOT_FOUND)
        } else {
            throw error
        }
    }
})

cardDao('should throw a CARD_NOT_FOUND error when no card is found to be updated', async ({mock, sut}) => {
    const noUpdatedCardsResult = new QueryResultBuilder().withRowCount(0).build()
    mock.returnResult(noUpdatedCardsResult)
    try {
        await sut.update(new CardBuilder().build())
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.CARD_NOT_FOUND)
        } else {
            throw error
        }
    }
})

cardDao('should return the found card when searching by card id', async ({mock, sut}) => {
    const cardId = CardIdentification.create()
    const card = new CardBuilder().setId(cardId).build()
    const resultWithFoundCard = new QueryResultBuilder().withRows([new CardPostgresMapperTestHelper().cardToRow(card)]).withRowCount(1).build()
    mock.returnResult(resultWithFoundCard)
    const result = await sut.findById(cardId)
    assertCardsAreEqualsInAnyOrder([result], [card])
})

cardDao('should return the found cards when searching by author id', async ({mock, sut}) => {
    const authorId = AuthorIdentification.create()
    const cards: Card[] = [
        new CardBuilder().withAuthorId(authorId.getId()).build(),
        new CardBuilder().withAuthorId(authorId.getId()).build(),
    ]
    const resultWithFoundCards = new QueryResultBuilder().withRows(cards.map(new CardPostgresMapperTestHelper().cardToRow)).withRowCount(1).build()
    mock.returnResult(resultWithFoundCards)
    const result = await sut.findByAuthorId(AuthorIdentification.create())
    assertCardsAreEqualsInAnyOrder(result, cards)
})

cardDao('should return the found cards when searching by labelling', async ({mock, sut}) => {
    const search = ['label1', 'label2']
    const foundCards = [
        new CardBuilder().withLabels(search).build(),
        new CardBuilder().withLabels([...search, 'label3']).build(),
    ]

    mock.returnResult(new QueryResultBuilder().withRows(foundCards.map(new CardPostgresMapperTestHelper().cardToRow)).build())
    const result = await sut.findByLabelling(Labelling.fromStringLabels(search))

    assertCardsAreEqualsInAnyOrder(result, foundCards);
})

cardDao.run()

