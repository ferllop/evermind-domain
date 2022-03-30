import {assert, suite} from '../test-config.js'
import {UserSubscribesToCardUseCase} from '../../src/use-cases/UserSubscribesToCardUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredUser, givenAStoredUserWithPermissions, givenASubscription, withAnyRequester,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {
    assertSubscriptionHasCertainLevel,
    assertSubscriptionIsNotStored, assertSubscriptionIsStored,
} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {UserIsAlreadySubscribedToCardError} from '../../src/domain/errors/UserIsAlreadySubscribedToCardError.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'
import {CardNotFoundError} from '../../src/domain/errors/CardNotFoundError.js'
import {SubscriptionBuilder} from '../domain/subscription/SubscriptionBuilder.js'
import {Response} from '../../src/index.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'

const userSubscribesToCard = suite('User subscribes to card')

userSubscribesToCard.before.each(async () => await givenACleanInMemoryDatabase())

userSubscribesToCard('given a user subscribed to a card, ' +
    'when subscribing again, should return a USER_IS_ALREADY_SUBSCRIBED_TO_CARD error', async () => {
    const user = await givenAStoredUserWithPermissions(['SUBSCRIBE_ITSELF_TO_CARD'])
    const card = await givenAStoredCard()
    await givenASubscription(user, card)
    const request = {
        requesterId: user.id,
        userId: user.id,
        cardId: card.id,
    }
    const result = await new UserSubscribesToCardUseCase().execute(request)
    assert.equal(result.error, new UserIsAlreadySubscribedToCardError().toDto())
})

userSubscribesToCard(
    'given an existing user id and an existing card id, ' +
    'then create a subscription in Level 0', async () => {
        const user = await givenAStoredUserWithPermissions(['SUBSCRIBE_ITSELF_TO_CARD'])
        const {id: cardId} = await givenAStoredCard()
        await new UserSubscribesToCardUseCase().execute({
            requesterId: user.id,
            userId: user.id,
            cardId,
        })
        await assertSubscriptionHasCertainLevel(user.id, cardId, 0)
    })

userSubscribesToCard(
    'given an existing user id and an existing card id, ' +
    'then return the subscription dto', async () => {
        const {id: userId} = await givenAStoredUserWithPermissions(['SUBSCRIBE_ITSELF_TO_CARD'])
        const {id: cardId} = await givenAStoredCard()
        await assertSubscriptionIsNotStored(userId, cardId)
        const subscription = await new UserSubscribesToCardUseCase().execute({
            requesterId: userId,
            userId,
            cardId,
        })
        const expectedSubscription = new SubscriptionBuilder()
            .setId(subscription.data!.id)
            .setCardId(cardId)
            .setUserId(userId)
            .setLastReview(new Date(subscription.data!.lastReview)).build().toDto()
        assert.equal(subscription.data, expectedSubscription)
    })

userSubscribesToCard(
    'given a user without permissions, ' +
    'when subscribe an existing user to an existing card, ' +
    'then return a UserIsNotAuthorizedError SUBSCRIBE_OTHER_TO_CARD', async () => {
        const requester = await givenAStoredUserWithPermissions([])
        const card = await givenAStoredCard()
        const result = await new UserSubscribesToCardUseCase().execute({
            requesterId: requester.id,
            userId: requester.id,
            cardId: card.id,
        })
        assert.equal(
            result,
            Response.withDomainError(
                new UserIsNotAuthorizedError(['SUBSCRIBE_ITSELF_TO_CARD'])))
        await assertSubscriptionIsNotStored(requester.id, card.id)
    })

userSubscribesToCard(
    'given a user with permissions to subscribe other users to cards, ' +
    'when subscribe an existing user to an existing card, ' +
    'then subscribe', async () => {
        const requester = await givenAStoredUserWithPermissions(['SUBSCRIBE_OTHER_TO_CARD'])
        const user = await givenAStoredUser()
        const card = await givenAStoredCard()
        await new UserSubscribesToCardUseCase().execute({
            requesterId: requester.id,
            userId: user.id,
            cardId: card.id,
        })
        await assertSubscriptionIsStored(user.id, card.id)
    })

userSubscribesToCard(
    'given a user without permissions, ' +
    'when subscribe an existing user to an existing card, ' +
    'then return a UserIsNotAuthorizedError SUBSCRIBE_OTHER_TO_CARD', async () => {
        const requester = await givenAStoredUserWithPermissions([])
        const user = await givenAStoredUser()
        const card = await givenAStoredCard()
        const result = await new UserSubscribesToCardUseCase().execute({
            requesterId: requester.id,
            userId: user.id,
            cardId: card.id,
        })
        assert.equal(
            result,
            Response.withDomainError(
                new UserIsNotAuthorizedError(['SUBSCRIBE_OTHER_TO_CARD'])))
        await assertSubscriptionIsNotStored(user.id, card.id)
    })

userSubscribesToCard('given a non existing user id and an existing card id, then the subscription is not done and return a USER_NOT_FOUND error', async () => {
    const card = await givenAStoredCard()
    const userId = 'non-existent-user-id'
    const subscription = withAnyRequester({userId, cardId: card.id})
    const result = await new UserSubscribesToCardUseCase().execute(subscription)
    await assertSubscriptionIsNotStored(userId, card.id)
    assert.equal(result.error, new UserNotFoundError().toDto())
})

userSubscribesToCard(
    'given an existing user id and non existing card id, ' +
    'then the subscription is not done and return a CARD_NOT_FOUND error', async () => {
        const user = await givenAStoredUser()
        const cardId = 'non-existent-card-id'
        const subscription = withAnyRequester({userId: user.id, cardId})
        const result = await new UserSubscribesToCardUseCase().execute(subscription)
        await assertSubscriptionIsNotStored(user.id, cardId)
        assert.equal(result.error, new CardNotFoundError().toDto())
    })

userSubscribesToCard.run()
