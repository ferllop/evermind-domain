import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { Card } from '../../src/models/card/Card.js'
import { User } from '../../src/models/user/User.js'
import { Datastore } from '../../src/models/Datastore.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { CardMapper } from '../../src/models/card/CardMapper.js'
import { UserMapper } from '../../src/models/user/UserMapper.js'
import { UserSubscribesToCardUseCase } from '../../src/use-cases/UserSubscribesToCardUseCase.js'
import { UserUnsubscribesFromCardUseCase } from '../../src/use-cases/UserUnsubscribesFromCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { UserMother } from '../models/user/UserMother.js'
import { suite, assert } from '../test-config.js'
import { Response } from '../../src/use-cases/Response.js'
import { precondition } from '../../src/implementations/preconditions.js'
import { ImplementationsContainer } from '../../src/implementations/ImplementationsContainer.js'

const userUnsubscribesFromCard = suite("User unsubscribes from card")

userUnsubscribesFromCard('given an existing user id subscribed to an existing cardid, then unsubscribe', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const datastore = ImplementationsContainer.get('datastore') as Datastore
    const mum = new DatastoreMother(datastore)
    const user = new UserMother().standard()
    mum.with(user).beingStored()
    const card = new CardMother().standard()
    mum.with(card).beingStored()
    
    const request = {
        userId: user.getId().getId(),
        cardId: card.getId().getId()
    }
    new UserSubscribesToCardUseCase().execute(request)
    new UserUnsubscribesFromCardUseCase().execute(request)

    assert.not.ok(datastore.read('subscriptions', request.userId + '#' + request.cardId))
})

userUnsubscribesFromCard('given an existing user id subscribed to an existing cardid, then return a ok withouth data response', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const datastore = ImplementationsContainer.get('datastore') as Datastore
    const mum = new DatastoreMother(datastore)
    const user = new UserMother().standard()
    mum.with(user).beingStored()
    const card = new CardMother().standard()
    mum.with(card).beingStored()
    
    const request = {
        userId: user.getId().getId(),
        cardId: card.getId().getId()
    }
    new UserSubscribesToCardUseCase().execute(request)

    const result = new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.OkWithoutData())
})

userUnsubscribesFromCard('given a previous unsubscription, when unsubscribing again, then return a SUBCRIPTION_NOT_EXISTS error', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const datastore = ImplementationsContainer.get('datastore') as Datastore
    const mum = new DatastoreMother(datastore)
    const user = new UserMother().standard()
    mum.with(user).beingStored()
    const card = new CardMother().standard()
    mum.with(card).beingStored()
    
    const request = {
        userId: user.getId().getId(),
        cardId: card.getId().getId()
    }
    new UserSubscribesToCardUseCase().execute(request)

    new UserUnsubscribesFromCardUseCase().execute(request)
    const result = new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS))
})

userUnsubscribesFromCard('given an existing user id not subscribed to an existing cardid, then return a SUBSCRIPTION_NOT_EXISTS', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const datastore = ImplementationsContainer.get('datastore') as Datastore
    const mum = new DatastoreMother(datastore)
    const user = new UserMother().standard()
    mum.with(user).beingStored()
    const card = new CardMother().standard()
    mum.with(card).beingStored()
    
    const request = {
        userId: user.getId().getId(),
        cardId: card.getId().getId()
    }

    const result = new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS))
})


userUnsubscribesFromCard('given a non existing userid, then return a USER_NOT_FOUND', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const datastore = ImplementationsContainer.get('datastore') as Datastore
    const mum = new DatastoreMother(datastore)
    const user = new UserMother().standard()
    mum.with(user).beingStored()
    const card = new CardMother().standard()
    mum.with(card).beingStored()
    
    const request = {
        userId: 'nonexistinguserid',
        cardId: card.getId().getId()
    }

    const result = new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
})

userUnsubscribesFromCard('given a non existing cardid, then return a CARD_NOT_FOUND', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const datastore = ImplementationsContainer.get('datastore') as Datastore
    const mum = new DatastoreMother(datastore)
    const user = new UserMother().standard()
    mum.with(user).beingStored()
    const card = new CardMother().standard()
    mum.with(card).beingStored()
    
    const request = {
        userId: user.getId().getId(),
        cardId: 'nonexistingcard'
    }

    const result = new UserUnsubscribesFromCardUseCase().execute(request)

    assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
})

userUnsubscribesFromCard.run()

class DatastoreMother {
    private dto?: any
    private mother?: any

    constructor(private datastore: Datastore){}

    with(obj: any) {
        if (obj instanceof User) {
            this.mother = new UserMother()
            this.dto = new UserMapper().toDto(obj)
        }
        if (obj instanceof Card) {
            this.mother = new CardMother()
            this.dto = new CardMapper().toDto(obj)
        }
        return this
    }

    beingStored() {
        precondition(this.dto)
        this.datastore.create(this.mother.TABLE_NAME as string, this.dto)
        this.dto = undefined
        return this
    }


}


