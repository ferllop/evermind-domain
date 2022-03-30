import {assert, suite} from '../../../../test-config.js'
import {assertQueriesAreEqual} from '../AssertQueriesAreEqual.js'
import {givenAnExistingUser} from '../user/UserScenario.js'
import {
    SubscriptionSqlQuery,
} from '../../../../../src/implementations/persistence/postgres/subscription/SubscriptionSqlQuery.js'
import {SubscriptionBuilder} from '../../../../domain/subscription/SubscriptionBuilder.js'
import {SubscriptionFactory} from '../../../../../src/domain/subscription/SubscriptionFactory.js'
import {givenAnExistingCard} from '../card/CardScenario.js'
import {
    SubscriptionPostgresDatastore,
} from '../../../../../src/implementations/persistence/postgres/subscription/SubscriptionPostgresDatastore.js'
import {assertAllRowsAreEqualToSubscriptions} from './AssertAllRowsAreEqualToSubscriptions.js'
import {SubscriptionIdentification} from '../../../../../src/domain/subscription/SubscriptionIdentification.js'
import {givenAnExistingSubscription, givenAnExistingSubscriptionFromUserId} from './SubscriptionScenario.js'
import {cleanDatabase} from '../PostgresTestHelper.js'
import {UserIdentification} from '../../../../../src/domain/user/UserIdentification.js'
import {AlwaysAuthorizedAuthorization} from '../../../AlwaysAuthorizedAuthorization.js'

const subscriptionSqlQuery = suite('Subscription Sql Query')

subscriptionSqlQuery.before.each(async () => await cleanDatabase())

subscriptionSqlQuery('should provide the correct create subscriptions table query', async () => {
    const sut = new SubscriptionSqlQuery().createTable()

    const expectedQuery = `CREATE TABLE subscriptions
                           (
                               id          UUID PRIMARY KEY,
                               user_id     UUID,
                               card_id     UUID,
                               level       SMALLINT,
                               last_review TIMESTAMPTZ,
                               FOREIGN KEY (user_id)
                                   REFERENCES users (id) ON DELETE CASCADE,
                               FOREIGN KEY (card_id)
                                   REFERENCES cards (id) ON DELETE CASCADE
                           )`
    assertQueriesAreEqual(sut, expectedQuery)
})

subscriptionSqlQuery('should provide the correct insert query', async () => {
    const subscription = new SubscriptionBuilder().build()
    const {id, userId, cardId, level, lastReview} = subscription.toDto()

    const sut = new SubscriptionSqlQuery().insert(subscription)

    const expectedQuery = `INSERT INTO subscriptions(id,
                                                     user_id,
                                                     card_id,
                                                     level,
                                                     last_review)
                           VALUES ('${id}',
                                   '${userId}',
                                   '${cardId}',
                                   ${level},
                                   '${lastReview}')`
    assertQueriesAreEqual(sut, expectedQuery)
})

subscriptionSqlQuery('should provide a working insert subscription query', async () => {
    const user = await givenAnExistingUser()
    const card = await givenAnExistingCard()
    const subscription = new SubscriptionBuilder()
        .withUserId(user.getId())
        .withCardId(card.getId()).build()

    const sut = new SubscriptionSqlQuery().insert(subscription)
    await new SubscriptionPostgresDatastore().query(sut)
    const storedSubscriptions = await new SubscriptionPostgresDatastore().query(
        `SELECT *
         FROM subscriptions`)
    assertAllRowsAreEqualToSubscriptions(storedSubscriptions.rows, [subscription])
})

subscriptionSqlQuery('should provide the correct query to delete the subscription with the provided id', async () => {
    const id = SubscriptionIdentification.create() as SubscriptionIdentification
    const sut = new SubscriptionSqlQuery().delete(id)
    const expectedQuery = `DELETE
                           FROM subscriptions
                           WHERE id = '${id.getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

subscriptionSqlQuery('should provide a working delete subscription query', async () => {
    const subscription = await givenAnExistingSubscription()

    const sut = new SubscriptionSqlQuery().delete(subscription.getId() as SubscriptionIdentification)

    let storedSubscription = await new SubscriptionPostgresDatastore().query('SELECT * FROM subscriptions')
    assert.equal(storedSubscription.rowCount, 1)
    await new SubscriptionPostgresDatastore().query(sut)
    storedSubscription = await new SubscriptionPostgresDatastore().query('SELECT * FROM subscriptions')
    assert.equal(storedSubscription.rowCount, 0)
})

subscriptionSqlQuery('should provide the correct subscription update query', async () => {
    const subscription = new SubscriptionBuilder().setLevel(3).build()
    const sut = new SubscriptionSqlQuery().update(subscription)
    const expectedQuery = `UPDATE subscriptions
                           SET level       = 3,
                               last_review = '${subscription.getLastReview().toDtoFormat()}'
                           WHERE id = '${subscription.getId().getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

subscriptionSqlQuery('should provide a working subscription update query', async () => {
    const subscription = await givenAnExistingSubscription()

    const updatedSubscription = {
        ...subscription.toDto(),
        level: 3,
    }
    const sut = new SubscriptionSqlQuery().update(
        new SubscriptionFactory(new AlwaysAuthorizedAuthorization()).fromDto(updatedSubscription))
    await new SubscriptionPostgresDatastore().query(sut)
    const storedSubscriptions = await new SubscriptionPostgresDatastore().query('SELECT * FROM subscriptions')
    assertAllRowsAreEqualToSubscriptions(storedSubscriptions.rows, [new SubscriptionFactory(new AlwaysAuthorizedAuthorization()).fromDto(updatedSubscription)])
})

subscriptionSqlQuery('should send the proper query to find a subscription by user', async () => {
    const userId = UserIdentification.create()
    const sut = new SubscriptionSqlQuery().findByUserId(userId)
    const expectedQuery = `SELECT id,
                                  user_id,
                                  card_id,
                                  level,
                                  last_review
                           FROM subscriptions
                           WHERE user_id = '${userId.getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

subscriptionSqlQuery('should return the found subscriptions when searching by user', async () => {
    const user = await givenAnExistingUser()
    const subscriptions = [
        await givenAnExistingSubscriptionFromUserId(user.getId()),
        await givenAnExistingSubscriptionFromUserId(user.getId()),
    ]

    const sut = new SubscriptionSqlQuery().findByUserId(user.getId())

    const result = await new SubscriptionPostgresDatastore().query(sut)
    assertAllRowsAreEqualToSubscriptions(result.rows, subscriptions)
})

subscriptionSqlQuery('should send the proper query to find a subscription by id', async () => {
    const id = SubscriptionIdentification.create()
    const sut = new SubscriptionSqlQuery().findById(id)
    const expectedQuery = `SELECT id,
                                  user_id,
                                  card_id,
                                  level,
                                  last_review
                           FROM subscriptions
                           WHERE id = '${id.getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

subscriptionSqlQuery('should send a working query to find a subscription by id', async () => {
    const subscription = await givenAnExistingSubscription()
    const sut = new SubscriptionSqlQuery().findById(subscription.getId())

    const foundSubscriptions = await new SubscriptionPostgresDatastore().query(sut)

    assertAllRowsAreEqualToSubscriptions(foundSubscriptions.rows, [subscription])
})

subscriptionSqlQuery.run()




