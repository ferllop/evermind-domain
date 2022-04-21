import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {PersistenceFactory} from '../../../../src/implementations/persistence/PersistenceFactory.js'
import {CardDto} from '../../../../src/domain/card/CardDto.js'
import {CardBuilder} from '../../../domain/card/CardBuilder.js'
import {UserBuilder} from '../../../domain/user/UserBuilder.js'
import {PermissionRepository} from '../../../../src/domain/authorization/permission/PermissionRepository.js'
import {PermissionValue} from '../../../../src/domain/authorization/permission/PermissionValue.js'
import {RequesterDto} from '../../../../src/use-cases/RequesterDto.js'
import {SubscriptionBuilder} from '../../../domain/subscription/SubscriptionBuilder.js'
import {StoredUser} from '../../../../src/domain/user/StoredUser.js'

const datastore = new InMemoryDatastore()
const usersTable = 'users'
const cardsTable = 'cards'
const subscriptionsTable = 'subscriptions'

export async function givenACleanInMemoryDatabase() {
    PersistenceFactory.setType('memory')
    await datastore.clean()
    const user = await givenAnEmptyUsersTable()
    const card = await givenAnEmptyCardsTable()
    await givenAnEmptySubscriptionsTable(user, card)
}

async function givenAnEmptyUsersTable() {
    const user = await givenAStoredUser()
    await datastore.delete(usersTable, user.getId().getId())
    return user
}

async function givenAnEmptyCardsTable() {
    const card = await givenAStoredCard()
    await datastore.delete(cardsTable, card.id)
    return card
}

async function givenAnEmptySubscriptionsTable(user: StoredUser, card: CardDto) {
    const subscription = await givenASubscription(user, card)
    await datastore.delete(subscriptionsTable, subscription.id)
    return subscription
}

export async function givenTheStoredUser(user: StoredUser) {
    await datastore.create(usersTable, user.toDto())
}

export async function givenAStoredUserWithPermissions(Permissions: PermissionValue[]) {
    const user = await givenAStoredUser()
    await givenTheStoredUserPermissions(user, ...Permissions)
    return user
}

export async function givenAStoredUser() {
    const user = new UserBuilder().build()
    await givenTheStoredUser(user)
    return user
}

export async function givenTheStoredUserPermissions(user: StoredUser, ...permissionValues: PermissionValue[]) {
    for await (const permissionValue of permissionValues) {
        const permission = {userId: user.getId().getId(), value: permissionValue}
        await new PermissionRepository().add(permission)
    }
    return user
}

export async function givenTheStoredCard(card: CardDto) {
    await datastore.create(cardsTable, card)
    return card
}

export async function givenAStoredCard() {
    return await givenTheStoredCard(new CardBuilder().buildDto())
}

export async function givenASubscription(user: StoredUser, card: CardDto) {
    const subscription = new SubscriptionBuilder().setUserId(user.getId().getId()).setCardId(card.id).build().toDto()
    await datastore.create(subscriptionsTable, subscription)
    return subscription
}

export async function givenAStoredSubscriptionFromUser(user: StoredUser) {
    const card = await givenAStoredCard()
    return givenASubscription(user, card)
}

export async function givenXStoredCards(quantity: number) {
    const cards: CardDto[] = []
    for (let i = 1; i <= quantity; i++) {
        const card = await givenAStoredCard()
        cards.push(card)
    }
    return cards
}

export async function givenAStoredCardFromUser(user: StoredUser) {
    const card = new CardBuilder().setAuthorId(user.getId()).buildDto()
    await givenTheStoredCard(card)
    return card
}

export async function givenAStoredCardWithLabels(...labels: string[]) {
    const card = new CardBuilder().withLabels(labels).buildDto()
    await givenTheStoredCard(card)
    return card
}

export async function givenAStoredPrivateCardWithLabels(...labels: string[]) {
    const card = new CardBuilder().withVisibility('PRIVATE').withLabels(labels).buildDto()
    await givenTheStoredCard(card)
    return card
}

export async function givenAStoredPrivateCardFromUser(user: StoredUser) {
    const card = new CardBuilder()
        .withVisibility('PRIVATE').withAuthorId(user.getId().getId()).buildDto()
    await givenTheStoredCard(card)
    return card
}

export function withAnyRequester<T>(request: T): T & RequesterDto {
    return {...request, requesterId: 'any-requester-id'}
}