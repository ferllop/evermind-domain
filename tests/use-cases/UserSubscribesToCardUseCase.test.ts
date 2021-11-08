import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { precondition } from '../../src/implementations/preconditions.js'
import { Datastore } from '../../src/models/Datastore.js'
import { InMemoryDatastore } from '../../src/implementations/InMemoryDatastore.js'
import { UserSubscribesToCardUseCase } from '../../src/use-cases/UserSubscribesToCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { SubscriptionMother } from '../models/subscription/SubscriptionMother.js'
import { UserMother } from '../models/user/UserMother.js'
import { suite, assert } from '../test-config.js'
import { ImplementationsContainer } from '../../src/implementations/ImplementationsContainer.js'

const userSubscribesToCard = suite("User subscribes to card")

userSubscribesToCard('given an existing user id and an existing cardid, then create a subscription with id properly formatted', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const db = ImplementationsContainer.get('datastore') as Datastore
    const datastore = new DatastoreMother(db)
    const userId = 'theuserid'
    datastore.user.withId(userId).beingStored()
    const cardId = 'thecardid'
    datastore.card.withId(cardId).beingStored()
    const subscription = { userId, cardId }
    new UserSubscribesToCardUseCase().execute(subscription)
    assert.ok(datastore.subscription.withId(userId + '#' + cardId).isPresent())
})

userSubscribesToCard('given a user subscribed to a card, when subscribing again, should return a USER_IS_ALREADY_SUBSCRIBED_TO_CARD error', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const db = ImplementationsContainer.get('datastore') as Datastore
    const datastore = new DatastoreMother(db)
    const userId = 'theuserid'
    datastore.user.withId(userId).beingStored()
    const cardId = 'thecardid'
    datastore.card.withId(cardId).beingStored()
    const subscription = { userId, cardId }
    new UserSubscribesToCardUseCase().execute(subscription)
    const result = new UserSubscribesToCardUseCase().execute(subscription)
    assert.ok(result.hasError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD))
})


userSubscribesToCard('given an existing user id and an existing cardid, then create a subscription in Level 0', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const db = ImplementationsContainer.get('datastore') as Datastore
    const datastore = new DatastoreMother(db)
    datastore.user.withId('theuserid').beingStored()
    datastore.card.withId('thecardid').beingStored()
    const subscription = {
        userId: 'theuserid',
        cardId: 'thecardid'
    }
    new UserSubscribesToCardUseCase().execute(subscription)
    assert.ok(datastore.subscription.hasLevel(0))
})

userSubscribesToCard('given a non existing user id and an existing cardid, then the subscription is not done and return a USER_NOT_FOUND error', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const db = ImplementationsContainer.get('datastore') as Datastore
    const datastore = new DatastoreMother(db)
    datastore.subscription.withId('someid').beingStored()
    const cardId = 'thecardid'
    datastore.card.withId(cardId).beingStored()
    const userId = 'nonexistentuserid'
    const subscription = { userId, cardId }
    const result = new UserSubscribesToCardUseCase().execute(subscription)
    assert.not.ok(datastore.subscription.withId(userId + '#' + cardId).isPresent())
    assert.ok(result.hasError(ErrorType.USER_NOT_FOUND))
})

userSubscribesToCard('given an existing user id and non existing cardid, then the subscription is not done and return a CARD_NOT_FOUND error', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const db = ImplementationsContainer.get('datastore') as Datastore
    const datastore = new DatastoreMother(db)
    const userId = 'theuserid'
    datastore.user.withId(userId).beingStored()
    datastore.subscription.withId('someid').beingStored()
    const cardId = 'nonexistentcardid'
    const subscription = { userId, cardId }
    const response = new UserSubscribesToCardUseCase().execute(subscription)
    assert.not.ok(datastore.subscription.withId(userId + '#' + cardId).isPresent())
    assert.ok(response.hasError(ErrorType.CARD_NOT_FOUND))
})

userSubscribesToCard.run()

class DatastoreMother {
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

    isPresent() {
        return Boolean(this.datastore.read(this.mother.TABLE_NAME, this.dto.id))
    }

    isPresentOnlyOnce() {
        return this.datastore.findMany(this.mother.TABLE_NAME, dto => dto.id === this.dto.id).length === 1
    }

    hasLevel(level: number) {
        this.dto = this.datastore.read(this.mother.TABLE_NAME, this.mother.id)
        return this.dto.level === level
    }

    beingStored() {
        precondition(this.dto)
        this.datastore.create(this.mother.TABLE_NAME as string, this.dto)
        this.dto = undefined
        return this
    }


}


