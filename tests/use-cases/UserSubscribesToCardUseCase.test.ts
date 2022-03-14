import {assert, suite} from '../test-config.js'
import {UserSubscribesToCardUseCase} from '../../src/use-cases/UserSubscribesToCardUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {
    assertSubscriptionHasCertainLevel,
    assertSubscriptionIsNotStored,
} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {UserIsAlreadySubscribedToCardError} from '../../src/domain/errors/UserIsAlreadySubscribedToCardError.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'
import {CardNotFoundError} from '../../src/domain/errors/CardNotFoundError.js'
import {SubscriptionBuilder} from '../domain/subscription/SubscriptionBuilder.js'

const userSubscribesToCard = suite("User subscribes to card")

userSubscribesToCard.before.each( async () => await givenACleanInMemoryDatabase())

userSubscribesToCard('given a user subscribed to a card, when subscribing again, should return a USER_IS_ALREADY_SUBSCRIBED_TO_CARD error', async () => {
    const user = await givenAStoredUser()
    const card = await givenAStoredCard()
    const subscriptionRequest = { userId: user.id, cardId: card.id }
    await new UserSubscribesToCardUseCase().execute(subscriptionRequest)
    const result = await new UserSubscribesToCardUseCase().execute(subscriptionRequest)
    assert.equal(result.error, new UserIsAlreadySubscribedToCardError().toDto())
})

userSubscribesToCard('given an existing user id and an existing card id, then create a subscription in Level 0', async () => {
    const {id: userId} = await givenAStoredUser()
    const {id: cardId} = await givenAStoredCard()
    await new UserSubscribesToCardUseCase().execute({
        userId,
        cardId,
    })
    await assertSubscriptionHasCertainLevel(userId, cardId, 0)
})

userSubscribesToCard('given an existing user id and an existing card id, then return the subscription dto', async () => {
    const {id: userId} = await givenAStoredUser()
    const {id: cardId} = await givenAStoredCard()
    const subscription = await new UserSubscribesToCardUseCase().execute({
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

userSubscribesToCard('given a non existing user id and an existing card id, then the subscription is not done and return a USER_NOT_FOUND error', async () => {
    const card = await givenAStoredCard()
    const userId = 'non-existent-user-id'
    const subscription = { userId, cardId: card.id }
    const result = await new UserSubscribesToCardUseCase().execute(subscription)
    await assertSubscriptionIsNotStored(userId, card.id)
    assert.equal(result.error, new UserNotFoundError().toDto())
})

userSubscribesToCard('given an existing user id and non existing card id, then the subscription is not done and return a CARD_NOT_FOUND error', async () => {
    const user = await givenAStoredUser()
    const cardId = 'non-existent-card-id'
    const subscription = { userId: user.id, cardId }
    const result = await new UserSubscribesToCardUseCase().execute(subscription)
    await assertSubscriptionIsNotStored(user.id, cardId)
    assert.equal(result.error, new CardNotFoundError().toDto())
})

userSubscribesToCard.run()
