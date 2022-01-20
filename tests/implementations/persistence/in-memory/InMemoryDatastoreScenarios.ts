import {UserDto} from '../../../../src/domain/user/UserDto'
import {UserMother} from '../../../domain/user/UserMother'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore'
import {CardMother} from '../../../domain/card/CardMother'
import {PersistenceFactory} from '../../../../src/implementations/persistence/PersistenceFactory'
import {CardDto} from '../../../../src/domain/card/CardDto'
import {CardBuilder} from '../../../domain/card/CardBuilder'

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

export async function givenXStoredUsers(quantity: number) {
    const users: UserDto[] = []
    for (let i = 1; i <= quantity; i++) {
        const user = new UserMother().numberedDto(i)
        users.push(user)
        await givenTheStoredUser(user)
    }
    return users
}

export async function givenAStoredUser() {
    const users = await givenXStoredUsers(1)
    return users[0]
}

export async function givenTheStoredUser(user: UserDto) {
    await datastore.create(usersTable, user)
}

export async function givenTheStoredCard(card: CardDto) {
    await datastore.create(cardsTable, card)
    return card
}
export async function givenAStoredCardFromUser(user: UserDto) {
    const card = new CardBuilder().withAuthorId(user.id).buildDto()
    await givenTheStoredCard(card)
    return card
}

export async function givenAStoredCard() {
    const cards = await givenXStoredCards(1)
    return cards[0]
}

export async function givenXStoredCards(quantity: number) {
    const cards: CardDto[] = []
    for (let i = 1; i <= quantity; i++) {
        const card = new CardMother().numberedDto(i)
        cards.push(card)
        await datastore.create(cardsTable, card)
    }
    return cards
}