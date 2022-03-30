import {UserDto} from '../../../../src/domain/user/UserDto.js'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {assert} from '../../../test-config.js'
import {CardDto} from '../../../../src/domain/card/CardDto.js'
import {SubscriptionDto} from '../../../../src/domain/subscription/SusbcriptionDto.js'
import {Id} from 'in-memory-database/build/Id'

const datastore = new InMemoryDatastore()

export async function assertUserIsStored(user: UserDto) {
    assert.equal(await datastore.read('users', user.id), user)
}

export async function assertUserIsNotStored(user: UserDto) {
    assert.equal(await datastore.read('users', user.id), null)
}

export async function assertCardIsStored(card: CardDto, message?: string) {
    assert.equal(await datastore.read('cards', card.id), card, message)
}

export async function assertUserHasStoredACard(unidentifiedCard: Omit<CardDto, 'id'>) {
    const cards = await datastore.findMany<CardDto>('cards',
        (row) => row.authorId === unidentifiedCard.authorId)
    assert.equal(cards.length, 1)
    assert.equal(cards[0], {...unidentifiedCard, id: cards[0].id})
}

export async function assertCardIsNotStored(card: CardDto, message?: string) {
    assert.equal(await datastore.read('cards', card.id), null, message)
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
    assert.not.equal(storedSubscription, null)
    assert.equal(storedSubscription!.level, level)
}