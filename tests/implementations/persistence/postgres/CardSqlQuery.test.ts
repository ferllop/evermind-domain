import {AuthorIdentification} from '../../../../src/domain/card/AuthorIdentification.js'
import {CardIdentification} from '../../../../src/domain/card/CardIdentification.js'
import {CardPostgresDao, CardRow} from '../../../../src/implementations/persistence/postgres/CardPostgresDao.js'
import {PostgresDatastore} from '../../../../src/implementations/persistence/postgres/PostgresDatastore.js'
import {CardBuilder} from '../../../domain/card/CardBuilder.js'
import {assert, suite} from '../../../test-config.js'
import {UserSqlQuery} from '../../../../src/implementations/persistence/postgres/UserSqlQuery'
import {CardSqlQuery} from '../../../../src/implementations/persistence/postgres/CardSqlQuery'
import {UserBuilder} from '../../../domain/user/UserBuilder'
import {UserDao} from '../../../../src/implementations/persistence/postgres/UserDao'
import {UserIdentification} from '../../../../src/domain/user/UserIdentification'
import {CardDto} from '../../../../src/domain/card/CardDto'
import {Card} from '../../../../src/domain/card/Card'
import {Labelling} from "../../../../src/domain/card/Labelling";
import {CardMapper} from "../../../../src/domain/card/CardMapper";
import {assertCardsAreEqualsInAnyOrder} from "./CardPostgresDao.test";

const cardSqlQuery = suite('Card Sql Query')

cardSqlQuery.before.each(async () => {
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

cardSqlQuery('should provide the correct insert query', async () => {
    const card = new CardBuilder().withLabels(['label1','label2']).build()
    const {id, authorID, question, answer} = card.toDto()

    const sut = new CardSqlQuery().insert(card)

    const expectedQuery = `BEGIN;
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
    INSERT INTO labelling 
    VALUES 
        ('${card.getId().getId()}','label1'),('${
        card.getId().getId()}','label2');
    COMMIT;`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should provide a working insert card query', async () => {
    const user = await givenAnExistingUser()
    const card = new CardBuilder().setAuthorID(user.getId() as AuthorIdentification).build()

    const sut = new CardSqlQuery().insert(card)

    await new PostgresDatastore().query(sut)
    const storedCards = await new PostgresDatastore().query('SELECT * FROM cards')
    assert.equal(storedCards.rowCount, 1)
    assertCardsAreEqual(storedCards.rows[0], card.toDto())
})

cardSqlQuery('should provide the correct query to delete the provided card', async () => {
    const id = CardIdentification.create()
    const sut = new CardSqlQuery().delete(id)
    const expectedQuery = `DELETE FROM cards WHERE id = '${id.getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should provide a working delete card query', async () => {
    const cardId = CardIdentification.create()
    await givenTheExistingCardWithId(cardId)

    const sut = new CardSqlQuery().delete(cardId)

    let storedCards = await new PostgresDatastore().query('SELECT * FROM cards')
    assert.equal(storedCards.rowCount, 1)
    await new PostgresDatastore().query(sut)
    storedCards = await new PostgresDatastore().query('SELECT * FROM cards')
    assert.equal(storedCards.rowCount, 0)
})

cardSqlQuery('should provide the correct card update query', async () => {
    const card = new CardBuilder().build()
    const sut = new CardSqlQuery().update(card)
    const expectedQuery = `BEGIN;
        UPDATE cards SET
        question = '${card.getQuestion().getValue()}',
        answer = '${card.getAnswer().getValue()}'
        WHERE id = '${card.getId().getId()}';
        DELETE FROM labelling WHERE card_id = '${card.getId().getId()}';
        INSERT INTO labelling VALUES ('${card.getId().getId()}','${card.getLabelling().getLabels()[0]}');
        COMMIT;`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should provide a working card update query', async () => {
    const card = await givenAnExistingCard()

    const updatedCard = {
        ...card.toDto(),
        question: 'updated question',
        answer: 'updated answer',
        labelling: ['updated-labelling', 'other']
    }
    const sut = new CardSqlQuery().update(Card.fromDto(updatedCard))

    await new PostgresDatastore().query(sut)
    const storedCards = await new PostgresDatastore().query(new CardSqlQuery().selectCardById(card.getId()))

    assertCardsAreEqual(storedCards.rows[0], updatedCard)
})

cardSqlQuery('should send the proper query to find a card by it\'s author', async () => {
    const authorId = AuthorIdentification.create()
    const sut = new CardSqlQuery().selectCardByAuthorId(authorId)
    const expectedQuery = `SELECT id, author_id, question, answer, array(SELECT label FROM labelling WHERE card_id = id) as labelling
        FROM cards 
        WHERE author_id = '${authorId.getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)

})

cardSqlQuery('should send a working query to find a card by it\'s author', async () => {
    const user = await givenSomeExistingCardsFromSameUser(3)
    const authorId = user.getId() as AuthorIdentification

    const sut = new CardSqlQuery().selectCardByAuthorId(authorId)

    const foundCards = await new PostgresDatastore().query(sut)
    assert.equal(foundCards.rowCount, 3)
})

cardSqlQuery('should send the proper query to find a card by one label', async () => {
    const labelling = Labelling.fromStringLabels(['label1'])
    const sut = new CardSqlQuery().selectCardByLabelling(labelling)
    const expectedQuery = `SELECT id, author_id, question, answer, array(SELECT label FROM labelling WHERE card_id = id) as labelling
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
    const expectedQuery = `SELECT id, author_id, question, answer, array(SELECT label FROM labelling WHERE card_id = id) as labelling
        FROM cards 
        WHERE id in (SELECT card_id FROM labelling WHERE label = 'label1' OR label = 'label2' GROUP BY card_id HAVING COUNT(label) = 2)`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should return the found cards when searching by labelling', async () => {
    const cardToFoundA = await givenTheExistingCardWithLabels('label1', 'label2')
    const cardToFoundB = await givenTheExistingCardWithLabels('label1', 'label2', 'label3')
    await givenTheExistingCardWithLabels('label1')

    const sut = new CardSqlQuery().selectCardByLabelling(Labelling.fromStringLabels(['label1', 'label2']))
    const result = await new PostgresDatastore().query(sut)
    assertAllRowsAreEqualToCards(result.rows, [cardToFoundB, cardToFoundA])
})

cardSqlQuery('should send the proper query to find a card by id', async () => {
    const cardId = CardIdentification.create()
    const sut = new CardSqlQuery().selectCardById(cardId)
    const expectedQuery = `SELECT id, author_id, question, answer, array(SELECT label FROM labelling WHERE card_id = id) as labelling
        FROM cards 
        WHERE id = '${cardId.getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

cardSqlQuery('should send a working query to find a card by id', async () => {
    const cardId = CardIdentification.create()
    const card = await givenTheExistingCardWithId(cardId)

    const sut = new CardSqlQuery().selectCardById(cardId)

    const foundCard = await new PostgresDatastore().query(sut)

    assert.equal(foundCard.rowCount, 1)
    assertCardsAreEqual(foundCard.rows[0], card.toDto())
})

async function givenAnExistingUser() {
    const user = new UserBuilder().setId(UserIdentification.create().getId()).build()
    await new UserDao().add(user)
    return user
}

export async function givenTheExistingCardWithId(id: CardIdentification) {
    const user = await givenAnExistingUser()

    const card = new CardBuilder()
        .setId(id)
        .setAuthorID(user.getId() as AuthorIdentification)
        .build()
    await new CardPostgresDao().insert(card)
    return card
}

export async function givenTheExistingCardWithLabels(...labels: string[]) {
    const user = await givenAnExistingUser()

    const card = new CardBuilder()
        .setAuthorID(user.getId() as AuthorIdentification)
        .setLabelling(Labelling.fromStringLabels(labels))
        .build()
    await new CardPostgresDao().insert(card)
    return card
}

async function givenAnExistingCard() {
    const user = await givenAnExistingUser()
    const card = new CardBuilder()
        .setAuthorID(user.getId() as AuthorIdentification)
        .build()
    await new CardPostgresDao().insert(card)
    return card
}

async function givenSomeExistingCardsFromSameUser(quantity: number) {
    const user = await givenAnExistingUser()
    for (let i = 0; i < quantity; i++) {
        const card = new CardBuilder()
            .setAuthorID(user.getId() as AuthorIdentification)
            .build()
        await new CardPostgresDao().insert(card)
    }
    return user
}

function assertCardsAreEqual(pgCard: Record<string, any>, cardDto: CardDto) {
    const pgCardMap: Record<string, keyof CardDto> = {
        id: 'id',
        author_id: 'authorID',
        question: 'question',
        answer: 'answer',
        labelling: 'labelling',
    }

    Object.keys(pgCard).forEach(key => {
        const mappedKey = pgCardMap[key]
        assert.equal(pgCard[key], cardDto[mappedKey])
    })
}

function assertAllRowsAreEqualToCards(rows: CardRow[], cards: Card[]) {
    const cardRows = rows.map(fromRowToCardDto).map(dto => new CardMapper().fromDto(dto))
    assertCardsAreEqualsInAnyOrder(cardRows, cards)
}

function fromRowToCardDto(row: CardRow): CardDto {
    const pgCardMap: Record<string, keyof CardDto> = {
        id: 'id',
        author_id: 'authorID',
        question: 'question',
        answer: 'answer',
        labelling: 'labelling',
    }
    return Object.keys(row).reduce((accum, key) => {
        const value = row[key as keyof CardRow]
        return {
            ...accum,
            [pgCardMap[key]]: value
        }

    }, {}) as CardDto
}

cardSqlQuery.run()

function assertQueriesAreEqual(actual: string, expect: string) {
    const removeIndent = (str: string) => {
        return str.replace(/\s+/g, ' ')
    }
    assert.equal(removeIndent(actual), removeIndent(expect))
}




