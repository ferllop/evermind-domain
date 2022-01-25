import {ErrorType} from '../../src/domain/errors/ErrorType.js'
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

const userSubscribesToCard = suite("User subscribes to card")

userSubscribesToCard.before.each( async () => await givenACleanInMemoryDatabase())

userSubscribesToCard('given a user subscribed to a card, when subscribing again, should return a USER_IS_ALREADY_SUBSCRIBED_TO_CARD error', async () => {
    const user = await givenAStoredUser()
    const card = await givenAStoredCard()
    const subscriptionRequest = { userId: user.id, cardId: card.id }
    await new UserSubscribesToCardUseCase().execute(subscriptionRequest)
    const result = await new UserSubscribesToCardUseCase().execute(subscriptionRequest)
    assert.ok(result.hasError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD))
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

userSubscribesToCard('given a non existing user id and an existing card id, then the subscription is not done and return a USER_NOT_FOUND error', async () => {
    const card = await givenAStoredCard()
    const userId = 'non-existent-user-id'
    const subscription = { userId, cardId: card.id }
    const result = await new UserSubscribesToCardUseCase().execute(subscription)
    await assertSubscriptionIsNotStored(userId, card.id)
    assert.ok(result.hasError(ErrorType.USER_NOT_FOUND))
})

userSubscribesToCard('given an existing user id and non existing card id, then the subscription is not done and return a CARD_NOT_FOUND error', async () => {
    const user = await givenAStoredUser()
    const cardId = 'non-existent-card-id'
    const subscription = { userId: user.id, cardId }
    const response = await new UserSubscribesToCardUseCase().execute(subscription)
    await assertSubscriptionIsNotStored(user.id, cardId)
    assert.ok(response.hasError(ErrorType.CARD_NOT_FOUND))
})

userSubscribesToCard.run()
