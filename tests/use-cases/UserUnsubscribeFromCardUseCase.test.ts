import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredUser,
    givenAStoredUserWithPermissions,
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
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'
import {UserUnsubscribesFromCardUseCase} from '../../src/index.js'

const userUnsubscribesFromCard = suite("User unsubscribes from card")

userUnsubscribesFromCard.before.each( async () => {
    await givenACleanInMemoryDatabase()
})

userUnsubscribesFromCard(
    'given an existing user with permissions subscribed to an existing card id, ' +
    'when the same user unsubscribe from card ' +
    'then unsubscribe and return a ok without data response', async () => {
    const user = await givenAStoredUserWithPermissions(['UNSUBSCRIBE_ITSELF_FROM_CARD'])
    const card = await givenAStoredCard()
    await givenASubscription(user, card)
    await assertSubscriptionIsStored(user.id, card.id)
    const request = {
        requesterId: user.id,
        userId: user.id,
        cardId: card.id
    }
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)
    await assertSubscriptionIsNotStored(user.id, card.id)
    assert.equal(result, Response.OkWithoutData())
})

userUnsubscribesFromCard('given a previous unsubscription, ' +
    'when unsubscribing again, ' +
    'then return a SUBSCRIPTION_NOT_EXISTS error', async () => {
    const user = await givenAStoredUserWithPermissions(['UNSUBSCRIBE_ITSELF_FROM_CARD'])
    const card = await givenAStoredCard()
    await givenASubscription(user, card)
    const request = {
        requesterId: user.id,
        userId: user.id,
        cardId: card.id,
    }
    await new UserUnsubscribesFromCardUseCase().execute(request)
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)
    assert.equal(result, Response.withDomainError(new SubscriptionNotFoundError()))
})

userUnsubscribesFromCard('given an existing user id not subscribed to an existing card id, then return a SUBSCRIPTION_NOT_EXISTS', async () => {
    const user = await givenAStoredUserWithPermissions(['UNSUBSCRIBE_ITSELF_FROM_CARD'])
    const card = await givenAStoredCard()
    const request = {
        requesterId: user.id,
        userId: user.id,
        cardId: card.id,
    }
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)
    assert.equal(result, Response.withDomainError(new SubscriptionNotFoundError()))
})

userUnsubscribesFromCard(
    'given an existing user without permissions' +
    'when unsubscribes from an existing subscription, ' +
    'then return a UserIsNotAuthorizedError UNSUBSCRIBE_ITSELF_FROM_CARD', async () => {
    const user = await givenAStoredUserWithPermissions([])
    const card = await givenAStoredCard()
    await givenASubscription(user, card)
    const request = {
        requesterId: user.id,
        userId: user.id,
        cardId: card.id,
    }
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)
    assert.equal(result, Response.withDomainError(
        new UserIsNotAuthorizedError(['UNSUBSCRIBE_ITSELF_FROM_CARD'])))
})

userUnsubscribesFromCard(
    'given an existing user without permissions' +
    'when unsubscribes another user from an existing subscription, ' +
    'then return a UserIsNotAuthorizedError UNSUBSCRIBE_ITSELF_FROM_CARD', async () => {
    const requester = await givenAStoredUserWithPermissions(['UNSUBSCRIBE_ITSELF_FROM_CARD'])
    const user = await givenAStoredUser()
    const card = await givenAStoredCard()
    await givenASubscription(user, card)
    const request = {
        requesterId: requester.id,
        userId: user.id,
        cardId: card.id,
    }
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)
    assert.equal(result, Response.withDomainError(
        new UserIsNotAuthorizedError(['UNSUBSCRIBE_OTHER_FROM_CARD'])))
})

userUnsubscribesFromCard('given a non existing userid, then return a USER_NOT_FOUND', async () => {
    const nonStoredUser = new UserBuilder().buildDto()
    const card = await givenAStoredCard()
    await givenASubscription(nonStoredUser, card)
    const request = withAnyRequester({
        userId: nonStoredUser.id,
        cardId: card.id,
    })
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)
    assert.equal(result, Response.withDomainError(new UserNotFoundError()))
})

userUnsubscribesFromCard('given a non existing card id, then return a CARD_NOT_FOUND', async () => {
    const user = await givenAStoredUser()
    const request = withAnyRequester({
        userId: user.id,
        cardId: 'non-existing-card',
    })

    const result = await (new UserUnsubscribesFromCardUseCase()).execute(request)
    assert.equal(result, Response.withDomainError(new CardNotFoundError()))
})

userUnsubscribesFromCard.run()
