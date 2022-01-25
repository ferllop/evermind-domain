import {assert, suite} from '../test-config.js'
import {UserSearchesForCardsUseCase} from '../../src/use-cases/UserSearchesForCardsUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredCardFromUser,
    givenAStoredUser,
    givenTheStoredCard,
    givenTheStoredUser,
    givenXStoredCards,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {UserBuilder} from '../domain/user/UserBuilder.js'
import {CardBuilder} from '../domain/card/CardBuilder.js'

const userSearchesForCards = suite('User searches for cards use case')

userSearchesForCards.before.each(async () => await givenACleanInMemoryDatabase())

userSearchesForCards('having 0 coincident cards, return a Result with empty array as data and null as error', async () => {
    await givenXStoredCards(3)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: 'non-existing'
    })
    assert.is(result.data.length, 0)
})

userSearchesForCards('having three cards, with one coincident card, return a Result with a one element array as data and null as error', async () => {
    await givenXStoredCards(2)
    const labels = ['test-label']
    const cardToBeFound = new CardBuilder().withLabels(labels).buildDto()
    await givenTheStoredCard(cardToBeFound)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: labels.join()
    })
    assert.is(result.data.length, 1)
})

userSearchesForCards('having three cards, with one partial card, return a Result with an empty array as data and null as error', async () => {
    const cards = await givenXStoredCards(3)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: cards[0].labelling[0] + ', other-label'
    })
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 3 cards stored, two of them with same labels, return a Result with a two elements array as data and null as error', async () => {
    await givenAStoredCard()
    const label = ['coincident-label']
    await givenTheStoredCard(new CardBuilder().withLabels(label).buildDto())
    await givenTheStoredCard(new CardBuilder().withLabels(label).buildDto())

    const result = await new UserSearchesForCardsUseCase().execute({
        query: label.join()
    })
    assert.is(result.data.length, 2)
})

userSearchesForCards('having 1 card with two coincident labels, return a Result with one element array as data and null as error', async () => {
    await givenXStoredCards(2)
    const labels = ['label0ofcard1', 'label1ofcard1']
    await givenTheStoredCard(new CardBuilder().withLabels(labels).buildDto())
    const result = await new UserSearchesForCardsUseCase().execute({
        query: labels.join()
    })
    assert.is(result.data.length, 1)
})

userSearchesForCards('having 0 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', async () => {
    await givenAStoredUser()
    await givenXStoredCards(3)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@non-existing-author'
    })
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author, then return a Result with with a one element array  as data and null as error', async () => {
    const user = new UserBuilder().setId('real-id').setUsername('real-username').buildDto()
    await givenTheStoredUser(user)
    const cardToBeFound = new CardBuilder().withAuthorId(user.id).buildDto()
    await givenTheStoredCard(cardToBeFound)

    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@' + user.username
    })
    assert.is(result.data.length, 1)
    assert.equal(result.data[0], cardToBeFound)
})

userSearchesForCards('having 0 coincident cards, when searching by author and label, then return a Result with an empty array as data and null as error', async () => {
    const user = new UserBuilder().setId('real-id').setUsername('real-username').buildDto()
    await givenXStoredCards(3)
    await givenAStoredCardFromUser(user)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@real-username, non-existing-label'
    })
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author and label, then return a Result with a one element array as data and null as error', async () => {
    const user = new UserBuilder()
        .setId('real-id')
        .setUsername('real-username')
        .buildDto()
    await givenTheStoredUser(user)

    await givenXStoredCards(3)
    const card = new CardBuilder()
        .withAuthorId(user.id)
        .withLabels(['real-label1'])
        .buildDto()
    await givenTheStoredCard(card)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@real-username, real-label1'})
    assert.is(result.data.length, 1)
})

userSearchesForCards.run()
