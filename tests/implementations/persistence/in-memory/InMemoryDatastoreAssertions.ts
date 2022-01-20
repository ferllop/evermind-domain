import {UserDto} from '../../../../src/domain/user/UserDto'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore'
import {assert} from '../../../test-config'
import {CardDto} from '../../../../src/domain/card/CardDto'
import {SubscriptionDto} from '../../../../src/domain/subscription/SusbcriptionDto'
import {Id} from 'in-memory-database/build/Id'

const datastore = new InMemoryDatastore()

export async function assertUserIsStored(user: UserDto) {
    assert.equal(await datastore.read('users', user.id), user)
}

export async function assertUserIsNotStored(user: UserDto) {
    assert.equal(await datastore.read('users', user.id), null)
}

export async function assertCardIsStored(card: CardDto) {
    assert.equal(await datastore.read('cards', card.id), card)
}

export async function assertCardIsNotStored(card: CardDto) {
    assert.equal(await datastore.read('cards', card.id), null)
}

export async function assertSubscriptionIsStored(userId: Id, cardId: Id) {
    assert.ok(
        await datastore.findOne<SubscriptionDto>('subscriptions', (subscription) => {
            return cardId === subscription.cardId && userId === subscription.userId
        }),
    )
}

export async function assertSubscriptionIsNotStored(userId: Id, cardId: Id) {
    assert.equal(await datastore.findOne<SubscriptionDto>('subscriptions', (subscription) => {
        return cardId === subscription.cardId && userId === subscription.userId
    }), null)
}

export async function assertSubscriptionHasCertainLevel(userId: Id, cardId: Id, level: number) {
    const storedSubscription = await datastore.findOne<SubscriptionDto>('subscriptions', (subscription) => {
        return cardId === subscription.cardId && userId === subscription.userId
    })
    assert.equal(storedSubscription!.level, level)
}