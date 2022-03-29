import {UserDto} from '../../../../src/domain/user/UserDto.js'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {PersistenceFactory} from '../../../../src/implementations/persistence/PersistenceFactory.js'
import {CardDto} from '../../../../src/domain/card/CardDto.js'
import {CardBuilder} from '../../../domain/card/CardBuilder.js'
import {UserBuilder} from '../../../domain/user/UserBuilder.js'
import {PermissionRepository} from '../../../../src/domain/authorization/permission/PermissionRepository.js'
import {PermissionValue} from '../../../../src/domain/authorization/permission/PermissionValue.js'
import {RequesterDto} from '../../../../src/use-cases/RequesterDto.js'

const datastore = new InMemoryDatastore()
const usersTable = 'users'
const cardsTable = 'cards'

export async function givenACleanInMemoryDatabase() {
    PersistenceFactory.setType('memory')
    await datastore.clean()
    await createUsersTable()
    await createCardsTable()
}

async function createUsersTable() {
    const user = await givenAStoredUser()
    await datastore.delete(usersTable, user.id)
}

async function createCardsTable() {
    const card = await givenAStoredCard()
    await datastore.delete(cardsTable, card.id)
}

export async function givenTheStoredUser(user: UserDto) {
    await datastore.create(usersTable, user)
}

export async function givenAStoredUserWithPermissions(Permissions: PermissionValue[]) {
    const user = await givenAStoredUser()
    await withPermissions(user, ...Permissions)
    return user
}

export async function givenAStoredUser() {
    const user = new UserBuilder().buildDto()
    await givenTheStoredUser(user)
    return user
}

export async function withPermissions(user: UserDto, ...permissionValues: PermissionValue[]) {
    for await (const permissionValue of permissionValues) {
        const permission = {userId: user.id, value: permissionValue}
        await new PermissionRepository().add(permission)
    }
    return user
}

export async function givenXStoredUsers(quantity: number) {
    const users: UserDto[] = []
    for (let i = 1; i <= quantity; i++) {
        const user = await givenAStoredUser()
        users.push(user)
    }
    return users
}

export async function givenTheStoredCard(card: CardDto) {
    await datastore.create(cardsTable, card)
    return card
}

export async function givenAStoredCard() {
    return await givenTheStoredCard(new CardBuilder().buildDto())
}

export async function givenXStoredCards(quantity: number) {
    const cards: CardDto[] = []
    for (let i = 1; i <= quantity; i++) {
        const card = await givenAStoredCard()
        cards.push(card)
    }
    return cards
}

export async function givenAStoredCardFromUser(user: UserDto) {
    const card = new CardBuilder().withAuthorId(user.id).buildDto()
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

export async function givenAStoredPrivateCardFromUser(user: UserDto) {
    const card = new CardBuilder()
        .withVisibility('PRIVATE').withAuthorId(user.id).buildDto()
    await givenTheStoredCard(card)
    return card
}

export function withAnyRequester<T>(request: T): T & RequesterDto {
    return {...request, requesterId: 'any-requester-id'}
}