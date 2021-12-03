import { ErrorType } from '../../src/domain/errors/ErrorType.js'
import { precondition } from '../../src/implementations/preconditions.js'
import { CardMother } from '../domain/card/CardMother.js'
import { SubscriptionMother } from '../domain/subscription/SubscriptionMother.js'
import { UserMother } from '../domain/user/UserMother.js'
import { suite, assert } from '../test-config.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { Datastore } from '../../src/domain/Datastore.js'
import { UserSubscribesToCardUseCase } from '../../src/use-cases/UserSubscribesToCardUseCase.js'

const userSubscribesToCard = suite("User subscribes to card")

userSubscribesToCard('given an existing user id and an existing cardid, then create a subscription with id properly formatted', async () => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    const db = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    const datastore = new AsyncDatastoreMother(db)
    const userId = 'theuserid'
    await datastore.user.withId(userId).beingStored()
    const cardId = 'thecardid'
    await datastore.card.withId(cardId).beingStored()
    const subscription = { userId, cardId }
    await new UserSubscribesToCardUseCase().execute(subscription)
    assert.ok(await datastore.subscription.withId(userId + '#' + cardId).isPresent())
})

userSubscribesToCard('given a user subscribed to a card, when subscribing again, should return a USER_IS_ALREADY_SUBSCRIBED_TO_CARD error', async () => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    const db = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    const datastore = new AsyncDatastoreMother(db)
    const userId = 'theuserid'
    await datastore.user.withId(userId).beingStored()
    const cardId = 'thecardid'
    await datastore.card.withId(cardId).beingStored()
    const subscription = { userId, cardId }
    await new UserSubscribesToCardUseCase().execute(subscription)
    const result = await new UserSubscribesToCardUseCase().execute(subscription)
    assert.ok(result.hasError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD))
})


userSubscribesToCard('given an existing user id and an existing cardid, then create a subscription in Level 0', async () => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    const db = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    const datastore = new AsyncDatastoreMother(db)
    await datastore.user.withId('theuserid').beingStored()
    await datastore.card.withId('thecardid').beingStored()
    const subscription = {
        userId: 'theuserid',
        cardId: 'thecardid'
    }
    await new UserSubscribesToCardUseCase().execute(subscription)
    assert.ok(await datastore.subscription.hasLevel(0))
})

userSubscribesToCard('given a non existing user id and an existing cardid, then the subscription is not done and return a USER_NOT_FOUND error', async () => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    const db = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    const datastore = new AsyncDatastoreMother(db)
    await datastore.subscription.withId('someid').beingStored()
    const cardId = 'thecardid'
    await datastore.card.withId(cardId).beingStored()
    const userId = 'nonexistentuserid'
    const subscription = { userId, cardId }
    const result = await new UserSubscribesToCardUseCase().execute(subscription)
    assert.not.ok(await datastore.subscription.withId(userId + '#' + cardId).isPresent())
    assert.ok(result.hasError(ErrorType.USER_NOT_FOUND))
})

userSubscribesToCard('given an existing user id and non existing cardid, then the subscription is not done and return a CARD_NOT_FOUND error', async () => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    const db = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    const datastore = new AsyncDatastoreMother(db)
    const userId = 'theuserid'
    await datastore.user.withId(userId).beingStored()
    await datastore.subscription.withId('someid').beingStored()
    const cardId = 'nonexistentcardid'
    const subscription = { userId, cardId }
    const response = await new UserSubscribesToCardUseCase().execute(subscription)
    assert.not.ok(await datastore.subscription.withId(userId + '#' + cardId).isPresent())
    assert.ok(response.hasError(ErrorType.CARD_NOT_FOUND))
})

userSubscribesToCard.run()

class AsyncDatastoreMother {
    private dto?: any
    private mother?: any

    constructor(private datastore: Datastore){}

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

    async isPresentOnlyOnce() {
        const dtos = await this.datastore.findMany(this.mother.TABLE_NAME, dto => dto.id === this.dto.id)
        return dtos.length === 1
    }

    async hasLevel(level: number) {
        this.dto = await this.datastore.read(this.mother.TABLE_NAME, this.mother.id)
        return this.dto.level === level
    }

    async beingStored() {
        precondition(this.dto)
        await this.datastore.create(this.mother.TABLE_NAME as string, this.dto)
        this.dto = undefined
        return this
    }


}


