import {AuthorIdentification} from '../../../../../src/domain/card/AuthorIdentification.js'
import {CardIdentification} from '../../../../../src/domain/card/CardIdentification.js'
import {CardBuilder} from '../../../../domain/card/CardBuilder.js'
import {assert, suite} from '../../../../test-config.js'
import {CardSqlQuery} from '../../../../../src/implementations/persistence/postgres/card/CardSqlQuery.js'
import {Labelling} from '../../../../../src/domain/card/Labelling.js'
import {assertQueriesAreEqual} from '../AssertQueriesAreEqual.js'
import {assertAllRowsAreEqualToCards} from './CardAssertion.js'
import {givenAnExistingUser} from '../user/UserScenario.js'
import {
    givenAnExistingCard,
    givenSomeExistingCardsFromSameUser,
    givenTheExistingCardWithId,
    givenTheExistingCardWithLabels,
} from './CardScenario.js'
import {cleanDatabase} from '../PostgresTestHelper.js'
import {CardFactory} from '../../../../../src/domain/card/CardFactory.js'
import {
    CardPostgresDatastore,
} from '../../../../../src/implementations/persistence/postgres/card/CardPostgresDatastore.js'
import {AlwaysAuthorizedAuthorization} from '../../../AlwaysAuthorizedAuthorization.js'
import {CardDto} from '../../../../../src/index.js'

const cardSqlQuery = suite('Card Sql Query')

cardSqlQuery.before.each(async () => await cleanDatabase())

cardSqlQuery('should provide the correct create cards table query', async () => {
    const sut = new CardSqlQuery().createCardsTable()
    const expectedQuery = `CREATE TABLE cards
                (
                    id       UUID PRIMARY KEY,
                    author_id   UUID,
                    question TEXT,
                    answer   TEXT,
                    visibility TEXT,
                    FOREIGN KEY (author_id)
                        REFERENCES users (id) ON DELETE CASCADE
                );`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should provide the correct insert query', async () => {
    const card = new CardBuilder().withLabels(['label1','label2']).build()
    const {id, authorId, question, answer, visibility} = card.toDto()

    const sut = new CardSqlQuery().insert(card)

    const expectedQuery = `BEGIN;
    INSERT INTO cards(
        id, 
        author_id, 
        question, 
        answer,
        visibility
        ) VALUES (
        '${id}',
        '${authorId}',
        '${question}',
        '${answer}',
        '${visibility}');
    INSERT INTO labelling 
    VALUES 
        ('${card.getId().getValue()}','label1'),('${
        card.getId().getValue()}','label2');
    COMMIT;`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should provide a working insert card query', async () => {
    const user = await givenAnExistingUser()
    const card = new CardBuilder().setAuthorId(user.getId()).build()

    const sut = new CardSqlQuery().insert(card)

    await new CardPostgresDatastore().query(sut)
    const storedCards = await new CardPostgresDatastore().query(
        'SELECT *, array(SELECT label FROM labelling WHERE card_id = id) as labelling FROM cards')
    assert.equal(storedCards.rowCount, 1)
    assertAllRowsAreEqualToCards(storedCards.rows, [card])
})

cardSqlQuery('should provide the correct query to delete the provided card', async () => {
    const id = CardIdentification.create()
    const sut = new CardSqlQuery().delete(id)
    const expectedQuery = `DELETE FROM cards WHERE id = '${id.getValue()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should provide a working delete card query', async () => {
    const cardId = CardIdentification.create()
    await givenTheExistingCardWithId(cardId)

    const sut = new CardSqlQuery().delete(cardId)

    let storedCards = await new CardPostgresDatastore().query('SELECT * FROM cards')
    assert.equal(storedCards.rowCount, 1)
    await new CardPostgresDatastore().query(sut)
    storedCards = await new CardPostgresDatastore().query('SELECT * FROM cards')
    assert.equal(storedCards.rowCount, 0)
})

cardSqlQuery('should provide the correct card update query', async () => {
    const card = new CardBuilder().build()
    const sut = new CardSqlQuery().update(card)
    const dto = card.toDto()
    const expectedQuery = `BEGIN;
        UPDATE cards SET
        question = '${dto.question}',
        answer = '${dto.answer}',
        visibility = '${dto.visibility}'
        WHERE id = '${(card.getId().getValue())}';
        DELETE FROM labelling WHERE card_id = '${(card.getId().getValue())}';
        INSERT INTO labelling VALUES ('${(card.getId().getValue())}','${dto.labelling[0]}');
        COMMIT;`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should provide a working card update query', async () => {
    const card = await givenAnExistingCard()

    const updatedCard: CardDto = {
        ...card.toDto(),
        question: 'updated question',
        answer: 'updated answer',
        labelling: ['updated-labelling', 'other'],
        visibility: 'PRIVATE',
    }
    const cardFactory = new CardFactory(new AlwaysAuthorizedAuthorization())
    const sut = new CardSqlQuery().update(cardFactory.fromDto(updatedCard))

    await new CardPostgresDatastore().query(sut)
    const storedCards = await new CardPostgresDatastore().query(new CardSqlQuery().selectCardById(card.getId()))

    assertAllRowsAreEqualToCards(storedCards.rows, [cardFactory.fromDto(updatedCard)])
})

cardSqlQuery('should send the proper query to find a card by it\'s author', async () => {
    const authorId = AuthorIdentification.create()
    const sut = new CardSqlQuery().selectCardByAuthorId(authorId)
    const expectedQuery = `SELECT id, author_id, question, answer, visibility, array(SELECT label FROM labelling WHERE card_id = id) as labelling
        FROM cards 
        WHERE author_id = '${authorId.getValue()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should send a working query to find a card by it\'s author', async () => {
    const user = await givenSomeExistingCardsFromSameUser(3)
    const sut = new CardSqlQuery().selectCardByAuthorId(user.getId())
    const foundCards = await new CardPostgresDatastore().query(sut)
    assert.equal(foundCards.rowCount, 3)
})

cardSqlQuery('should send the proper query to find a card by one label', async () => {
    const labelling = Labelling.fromStringLabels(['label1'])
    const sut = new CardSqlQuery().selectCardByLabelling(labelling)
    const expectedQuery = `SELECT id, author_id, question, answer, visibility, array(SELECT label FROM labelling WHERE card_id = id) as labelling
        FROM cards
        WHERE id in (SELECT card_id 
            FROM labelling 
            WHERE label = 'label1' 
            GROUP BY card_id 
            HAVING COUNT(label) = 1)`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should send the proper query to find a card by two labels', async () => {
    const labelling = Labelling.fromStringLabels(['label1', 'label2'])
    const sut = new CardSqlQuery().selectCardByLabelling(labelling)
    const expectedQuery = `SELECT id, author_id, question, answer, visibility, array(SELECT label FROM labelling WHERE card_id = id) as labelling
        FROM cards 
        WHERE id in (SELECT card_id FROM labelling WHERE label = 'label1' OR label = 'label2' GROUP BY card_id HAVING COUNT(label) = 2)`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should return the found cards when searching by labelling', async () => {
    const cardToFoundA = await givenTheExistingCardWithLabels('label1', 'label2')
    const cardToFoundB = await givenTheExistingCardWithLabels('label1', 'label2', 'label3')
    await givenTheExistingCardWithLabels('label1')

    const sut = new CardSqlQuery().selectCardByLabelling(Labelling.fromStringLabels(['label1', 'label2']))
    const result = await new CardPostgresDatastore().query(sut)
    assertAllRowsAreEqualToCards(result.rows, [cardToFoundB, cardToFoundA])
})

cardSqlQuery('should send the proper query to find a card by id', async () => {
    const cardId = CardIdentification.create()
    const sut = new CardSqlQuery().selectCardById(cardId)
    const expectedQuery = `SELECT id, author_id, question, answer, visibility, array(SELECT label FROM labelling WHERE card_id = id) as labelling
        FROM cards 
        WHERE id = '${cardId.getValue()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should send a working query to find a card by id', async () => {
    const cardId = CardIdentification.create()
    const card = await givenTheExistingCardWithId(cardId)

    const sut = new CardSqlQuery().selectCardById(cardId)

    const foundCard = await new CardPostgresDatastore().query(sut)

    assert.equal(foundCard.rowCount, 1)
    assertAllRowsAreEqualToCards(foundCard.rows, [card])
})

cardSqlQuery.run()
