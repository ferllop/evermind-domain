import { precondition } from '../../src/lib/preconditions.js'
import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { SubscribeUserToCardUseCase } from '../../src/use-cases/SubscribeUserToCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { SubscriptionMother } from '../models/subscription/SubscriptionMother.js'
import { UserMother } from '../models/user/UserMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { suite, assert } from '../test-config.js'

const subscribeUserToCard = suite("Subcribe user to card")

subscribeUserToCard('given an existing user id and an existing cardid, then create a subscription with id properly formatted', () => {
    const db = new InMemoryDatastore()
    const datastore = new DatastoreMother(db)
    const userId = 'theuserid'
    datastore.user.withId(userId).beingStored()
    const cardId = 'thecardid'
    datastore.card.withId(cardId).beingStored()
    const subscription = { userId, cardId }
    new SubscribeUserToCardUseCase().execute(subscription, db)
    assert.ok(datastore.subscription.withId(userId + '#' + cardId).isPresent())
})

subscribeUserToCard('given an existing user id and an existing cardid, then create a subscription in Level 0', () => {
    const db = new InMemoryDatastore()
    const datastore = new DatastoreMother(db)
    datastore.user.withId('theuserid').beingStored()
    datastore.card.withId('thecardid').beingStored()
    const subscription = {
        userId: 'theuserid',
        cardId: 'thecardid'
    }
    new SubscribeUserToCardUseCase().execute(subscription, db)
    assert.ok(datastore.subscription.hasLevel(0))
})

subscribeUserToCard('given a non existing user id and an existing cardid, then the subscription is not done and return a RESOURCE_NOT_FOUND error', () => {
    const db = new InMemoryDatastore()
    const datastore = new DatastoreMother(db)
    datastore.subscription.withId('someid').beingStored()
    const cardId = 'thecardid'
    datastore.card.withId(cardId).beingStored()
    const userId = 'nonexistentuserid'
    const subscription = { userId, cardId }
    const result = new SubscribeUserToCardUseCase().execute(subscription, db)
    assert.not.ok(datastore.subscription.withId(userId + '#' + cardId).isPresent())
    assert.ok(ResultMother.isNotFound(result))
})

subscribeUserToCard('given an existing user id and non existing cardid, then the subscription is not done and return a RESOURCE_NOT_FOUND error', () => {
    const db = new InMemoryDatastore()
    const datastore = new DatastoreMother(db)
    const userId = 'theuserid'
    datastore.user.withId(userId).beingStored()
    datastore.subscription.withId('someid').beingStored()
    const cardId = 'nonexistentcardid'
    const subscription = { userId, cardId }
    const result = new SubscribeUserToCardUseCase().execute(subscription, db)
    assert.not.ok(datastore.subscription.withId(userId + '#' + cardId).isPresent())
    assert.ok(ResultMother.isNotFound(result))
})

subscribeUserToCard.run()

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


