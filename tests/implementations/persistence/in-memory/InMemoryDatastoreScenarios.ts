import {UserDto} from '../../../../src/domain/user/UserDto'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore'
import {PersistenceFactory} from '../../../../src/implementations/persistence/PersistenceFactory'
import {CardDto} from '../../../../src/domain/card/CardDto'
import {CardBuilder} from '../../../domain/card/CardBuilder'
import {UserBuilder} from '../../../domain/user/UserBuilder'

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

export async function givenAStoredUser() {
    const user = new UserBuilder().buildDto()
    await givenTheStoredUser(user)
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