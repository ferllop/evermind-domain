import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {precondition} from '../../src/implementations/preconditions.js'
import {CardMother} from '../domain/card/CardMother.js'
import {SubscriptionMother} from '../domain/subscription/SubscriptionMother.js'
import {UserMother} from '../domain/user/UserMother.js'
import {assert, suite} from '../test-config.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {UserSubscribesToCardUseCase} from '../../src/use-cases/UserSubscribesToCardUseCase.js'
import {SubscriptionDto} from '../../src/domain/subscription/SusbcriptionDto'

type Context = {
    db: InMemoryDatastore
}

const userSubscribesToCard = suite<Context>("User subscribes to card")

userSubscribesToCard.before.each( async (context) => {
    context.db = new InMemoryDatastore()
    await context.db.clean()
})

userSubscribesToCard('given a user subscribed to a card, when subscribing again, should return a USER_IS_ALREADY_SUBSCRIBED_TO_CARD error', async ({db}) => {
    const datastore = new AsyncDatastoreMother(db)
    const userId = 'the-userid'
    await datastore.user.withId(userId).beingStored()
    const cardId = 'the-card-id'
    await datastore.card.withId(cardId).beingStored()
    const subscription = { userId, cardId }
    await new UserSubscribesToCardUseCase().execute(subscription)
    const result = await new UserSubscribesToCardUseCase().execute(subscription)
    assert.ok(result.hasError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD))
})


userSubscribesToCard('given an existing user id and an existing card id, then create a subscription in Level 0', async ({db}) => {
    const datastore = new AsyncDatastoreMother(db)
    await datastore.user.withId('the-user-id').beingStored()
    await datastore.card.withId('the-card-id').beingStored()
    const subscription = {
        userId: 'the-user-id',
        cardId: 'the-card-id'
    }
    await new UserSubscribesToCardUseCase().execute(subscription)
    const storedSubscriptions = await db.findMany<SubscriptionDto>('subscriptions', () => true)
    assert.equal(storedSubscriptions.length, 1)
    assert.equal(storedSubscriptions[0].level, 0)
})

userSubscribesToCard('given a non existing user id and an existing card id, then the subscription is not done and return a USER_NOT_FOUND error', async ({db}) => {
    const datastore = new AsyncDatastoreMother(db)
    await datastore.subscription.withId('some-id').beingStored()
    const cardId = 'the-card-id'
    await datastore.card.withId(cardId).beingStored()
    const userId = 'non-existent-user-id'
    const subscription = { userId, cardId }
    const result = await new UserSubscribesToCardUseCase().execute(subscription)
    assert.not.ok(await datastore.subscription.withId(userId + '#' + cardId).isPresent())
    assert.ok(result.hasError(ErrorType.USER_NOT_FOUND))
})

userSubscribesToCard('given an existing user id and non existing card id, then the subscription is not done and return a CARD_NOT_FOUND error', async ({db}) => {
    const datastore = new AsyncDatastoreMother(db)
    const userId = 'the-userid'
    await datastore.user.withId(userId).beingStored()
    await datastore.subscription.withId('some-id').beingStored()
    const cardId = 'non-existent-card-id'
    const subscription = { userId, cardId }
    const response = await new UserSubscribesToCardUseCase().execute(subscription)
    assert.not.ok(await datastore.subscription.withId(userId + '#' + cardId).isPresent())
    assert.ok(response.hasError(ErrorType.CARD_NOT_FOUND))
})

userSubscribesToCard.run()

class AsyncDatastoreMother {
    private dto?: any
    private mother?: any

    constructor(private datastore: InMemoryDatastore){}

    get user() {
        this.mother = new UserMother()
        return this
    }

    get card() {
        this.mother = new CardMother()
        return this
    }

    get subscription() {
        this.mother = new SubscriptionMother()
        return this
    }

    withId(id: string) {
        this.dto = this.mother.withId(id).getDto()
        return this
    }

    async isPresent() {
        return Boolean(await this.datastore.read(this.mother.TABLE_NAME, this.dto.id))
    }

    async beingStored() {
        precondition(this.dto)
        await this.datastore.create(this.mother.TABLE_NAME as string, this.dto)
        this.dto = undefined
        return this
    }


}


