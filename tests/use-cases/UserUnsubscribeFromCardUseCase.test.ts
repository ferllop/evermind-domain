import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {UserSubscribesToCardUseCase} from '../../src/use-cases/UserSubscribesToCardUseCase.js'
import {UserUnsubscribesFromCardUseCase} from '../../src/use-cases/UserUnsubscribesFromCardUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {
    assertSubscriptionIsNotStored,
    assertSubscriptionIsStored,
} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'

const userUnsubscribesFromCard = suite("User unsubscribes from card")

userUnsubscribesFromCard.before.each( async () => await givenACleanInMemoryDatabase())

userUnsubscribesFromCard('given an existing user id subscribed to an existing card id, then unsubscribe', async () => {
    const card = await givenAStoredCard()
    const user = await givenAStoredUser()

    const request = {
        userId: user.id,
        cardId: card.id
    }
    await new UserSubscribesToCardUseCase().execute(request)
    await assertSubscriptionIsStored(user.id, card.id)

    await new UserUnsubscribesFromCardUseCase().execute(request)
    await assertSubscriptionIsNotStored(user.id, card.id)
})

userUnsubscribesFromCard('given an existing user id subscribed to an existing card id, then return a ok without data response', async () => {
    const card = await givenAStoredCard()
    const user = await givenAStoredUser()
    const request = {
        userId: user.id,
        cardId: card.id
    }
    await new UserSubscribesToCardUseCase().execute(request)

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.OkWithoutData())
})

userUnsubscribesFromCard('given a previous unsubscription, when unsubscribing again, then return a SUBSCRIPTION_NOT_EXISTS error', async () => {
    const card = await givenAStoredCard()
    const user = await givenAStoredUser()
    const request = {
        userId: user.id,
        cardId: card.id
    }
    await new UserSubscribesToCardUseCase().execute(request)

    await new UserUnsubscribesFromCardUseCase().execute(request)
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS))
})

userUnsubscribesFromCard('given an existing user id not subscribed to an existing card id, then return a SUBSCRIPTION_NOT_EXISTS', async () => {
    const card = await givenAStoredCard()
    const user = await givenAStoredUser()
    const request = {
        userId: user.id,
        cardId: card.id
    }

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS))
})


userUnsubscribesFromCard('given a non existing userid, then return a USER_NOT_FOUND', async () => {
    const card = await givenAStoredCard()
    const request = {
        userId: 'non-existing-userid',
        cardId: card.id
    }
    await new UserSubscribesToCardUseCase().execute(request)

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
})

userUnsubscribesFromCard('given a non existing card id, then return a CARD_NOT_FOUND', async () => {
    const user = await givenAStoredUser()

    const request = {
        userId: user.id,
        cardId: 'non-existing-card'
    }

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
})

userUnsubscribesFromCard.run()
