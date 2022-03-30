import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {UserUnsubscribesFromCardUseCase} from '../../src/use-cases/UserUnsubscribesFromCardUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredUser,
    givenASubscription,
    withAnyRequester,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {
    assertSubscriptionIsNotStored,
    assertSubscriptionIsStored,
} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {SubscriptionNotFoundError} from '../../src/domain/errors/SubscriptionNotFoundError.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'
import {CardNotFoundError} from '../../src/domain/errors/CardNotFoundError.js'
import {UserBuilder} from '../domain/user/UserBuilder.js'

const userUnsubscribesFromCard = suite("User unsubscribes from card")

userUnsubscribesFromCard.before.each( async () => await givenACleanInMemoryDatabase())

userUnsubscribesFromCard(
    'given an existing user subscribed to an existing card id, ' +
    'when user unsubscribe from card ' +
    'then unsubscribe', async () => {
    const card = await givenAStoredCard()
    const user = await givenAStoredUser()
    await givenASubscription(user, card)
    await assertSubscriptionIsStored(user.id, card.id)
    const request = {
        userId: user.id,
        cardId: card.id
    }
    await new UserUnsubscribesFromCardUseCase().execute(request)
    await assertSubscriptionIsNotStored(user.id, card.id)
})

userUnsubscribesFromCard(
    'given an existing user id subscribed to an existing card id, ' +
    'then return a ok without data response', async () => {
    const card = await givenAStoredCard()
    const user = await givenAStoredUser()
    await givenASubscription(user, card)
    const request = {
        userId: user.id,
        cardId: card.id
    }
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)
    assert.equal(result, Response.OkWithoutData())
})

userUnsubscribesFromCard('given a previous unsubscription, ' +
    'when unsubscribing again, ' +
    'then return a SUBSCRIPTION_NOT_EXISTS error', async () => {
    const card = await givenAStoredCard()
    const user = await givenAStoredUser()
    await givenASubscription(user, card)
    const request = {
        userId: user.id,
        cardId: card.id
    }

    await new UserUnsubscribesFromCardUseCase().execute(request)
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withDomainError(new SubscriptionNotFoundError()))
})

userUnsubscribesFromCard('given an existing user id not subscribed to an existing card id, then return a SUBSCRIPTION_NOT_EXISTS', async () => {
    const card = await givenAStoredCard()
    const user = await givenAStoredUser()
    const request = {
        userId: user.id,
        cardId: card.id
    }

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withDomainError(new SubscriptionNotFoundError()))
})


userUnsubscribesFromCard('given a non existing userid, then return a USER_NOT_FOUND', async () => {
    const nonStoredUser = new UserBuilder().buildDto()
    const card = await givenAStoredCard()
    await givenASubscription(nonStoredUser, card)
    const request = withAnyRequester({
        userId: nonStoredUser.id,
        cardId: card.id
    })
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)
    assert.equal(result, Response.withDomainError(new UserNotFoundError()))
})

userUnsubscribesFromCard('given a non existing card id, then return a CARD_NOT_FOUND', async () => {
    const user = await givenAStoredUser()

    const request = {
        userId: user.id,
        cardId: 'non-existing-card'
    }

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withDomainError(new CardNotFoundError()))
})

userUnsubscribesFromCard.run()
