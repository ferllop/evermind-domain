import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Card} from '../../src/domain/card/Card.js'
import {User} from '../../src/domain/user/User.js'
import {CardMother} from '../domain/card/CardMother.js'
import {UserMother} from '../domain/user/UserMother.js'
import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {precondition} from '../../src/implementations/preconditions.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {UserSubscribesToCardUseCase} from '../../src/use-cases/UserSubscribesToCardUseCase.js'
import {UserUnsubscribesFromCardUseCase} from '../../src/use-cases/UserUnsubscribesFromCardUseCase.js'
import {SubscriptionDto} from '../../src/domain/subscription/SusbcriptionDto'
import {PersistenceFactory} from '../../src/implementations/persistence/PersistenceFactory'

type Context = {
    datastore: InMemoryDatastore
}

const userUnsubscribesFromCard = suite<Context>("User unsubscribes from card")

userUnsubscribesFromCard.before.each( async context => {
    context.datastore = new InMemoryDatastore()
    await context.datastore.clean()
    PersistenceFactory.setType('memory')
})

async function givenAStoredCard(datastore: InMemoryDatastore) {
    const mum = new AsyncDatastoreMother(datastore)
    const user = new UserMother().standard()
    await mum.with(user).beingStored()
    const card = new CardMother().standard()
    await mum.with(card).beingStored()
    return {user, card};
}

userUnsubscribesFromCard('given an existing user id subscribed to an existing card id, then unsubscribe', async ({datastore}) => {
    const {user, card} = await givenAStoredCard(datastore);

    const request = {
        userId: user.getId().getId(),
        cardId: card.getId().getId()
    }
    await new UserSubscribesToCardUseCase().execute(request)
    let storedSubscriptions = await datastore.findMany<SubscriptionDto>('subscriptions', () => true)
    assert.equal(storedSubscriptions.length, 1)

    await new UserUnsubscribesFromCardUseCase().execute(request)
    storedSubscriptions = await datastore.findMany<SubscriptionDto>('subscriptions', () => true)
    assert.equal(storedSubscriptions.length, 0)
})

userUnsubscribesFromCard('given an existing user id subscribed to an existing card id, then return a ok without data response', async ({datastore}) => {
    const {user, card} = await givenAStoredCard(datastore);
    
    const request = {
        userId: user.getId().getId(),
        cardId: card.getId().getId()
    }
    await new UserSubscribesToCardUseCase().execute(request)

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.OkWithoutData())
})

userUnsubscribesFromCard('given a previous unsubscription, when unsubscribing again, then return a SUBSCRIPTION_NOT_EXISTS error', async ({datastore}) => {
    const {user, card} = await givenAStoredCard(datastore);
    
    const request = {
        userId: user.getId().getId(),
        cardId: card.getId().getId()
    }
    await new UserSubscribesToCardUseCase().execute(request)

    await new UserUnsubscribesFromCardUseCase().execute(request)
    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS))
})

userUnsubscribesFromCard('given an existing user id not subscribed to an existing card id, then return a SUBSCRIPTION_NOT_EXISTS', async ({datastore}) => {
    const {user, card} = await givenAStoredCard(datastore);
    
    const request = {
        userId: user.getId().getId(),
        cardId: card.getId().getId()
    }

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS))
})


userUnsubscribesFromCard('given a non existing userid, then return a USER_NOT_FOUND', async ({datastore}) => {
    const {card} = await givenAStoredCard(datastore);
    
    const request = {
        userId: 'non-existing-userid',
        cardId: card.getId().getId()
    }

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
})

userUnsubscribesFromCard('given a non existing card id, then return a CARD_NOT_FOUND', async ({datastore}) => {
    const {user} = await givenAStoredCard(datastore);
    
    const request = {
        userId: user.getId().getId(),
        cardId: 'non-existing-card'
    }

    const result = await new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
})

userUnsubscribesFromCard.run()

class AsyncDatastoreMother {
    private dto?: any
    private mother?: any

    constructor(private datastore: InMemoryDatastore){}

    with(obj: any) {
        if (obj instanceof User) {
            this.mother = new UserMother()
            this.dto = obj.toDto()
        }
        if (obj instanceof Card) {
            this.mother = new CardMother()
            this.dto = obj.toDto()
        }
        return this
    }

    async beingStored() {
        precondition(this.dto)
        await this.datastore.create(this.mother.TABLE_NAME as string, this.dto)
        this.dto = undefined
        return this
    }

}


