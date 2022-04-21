import {assert, suite} from '../test-config.js'
import {UserSearchesForCardsUseCase} from '../../src/use-cases/UserSearchesForCardsUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredCardFromUser,
    givenAStoredCardWithLabels,
    givenAStoredPrivateCardFromUser,
    givenAStoredPrivateCardWithLabels,
    givenAStoredUser,
    givenAStoredUserWithPermissions,
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
    assert.is(result.data!.length, 0)
})

userSearchesForCards('having three cards, with one coincident card, return a Result with a one element array as data and null as error', async () => {
    await givenXStoredCards(2)
    const labels = ['test-label']
    const cardToBeFound = new CardBuilder().withLabels(labels).buildDto()
    await givenTheStoredCard(cardToBeFound)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: labels.join()
    })
    assert.is(result.data!.length, 1)
})

userSearchesForCards('having three cards, with one partial card, return a Result with an empty array as data and null as error', async () => {
    const cards = await givenXStoredCards(3)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: cards[0].labelling[0] + ', other-label'
    })
    assert.is(result.data!.length, 0)
})

userSearchesForCards('having 3 cards stored, two of them with same labels, return a Result with a two elements array as data and null as error', async () => {
    await givenAStoredCard()
    const label = ['coincident-label']
    await givenTheStoredCard(new CardBuilder().withLabels(label).buildDto())
    await givenTheStoredCard(new CardBuilder().withLabels(label).buildDto())

    const result = await new UserSearchesForCardsUseCase().execute({
        query: label.join()
    })
    assert.is(result.data!.length, 2)
})

userSearchesForCards('having 1 card with two coincident labels, return a Result with one element array as data and null as error', async () => {
    await givenXStoredCards(2)
    const labels = ['label0ofcard1', 'label1ofcard1']
    await givenTheStoredCard(new CardBuilder().withLabels(labels).buildDto())
    const result = await new UserSearchesForCardsUseCase().execute({
        query: labels.join()
    })
    assert.is(result.data!.length, 1)
})

userSearchesForCards('having 0 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', async () => {
    await givenAStoredUser()
    await givenXStoredCards(3)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@non-existing-author'
    })
    assert.is(result.data!.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author, then return a Result with with a one element array  as data and null as error', async () => {
    const user = new UserBuilder().setId('real-id').setUsername('real-username').buildDto()
    await givenTheStoredUser(user)
    const cardToBeFound = new CardBuilder().withAuthorId(user.id).buildDto()
    await givenTheStoredCard(cardToBeFound)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@' + user.username
    })
    assert.is(result.data!.length, 1)
    assert.equal(result.data![0], cardToBeFound)
})

userSearchesForCards('having 0 coincident cards, when searching by author and label, then return a Result with an empty array as data and null as error', async () => {
    const user = new UserBuilder().setId('real-id').setUsername('real-username').buildDto()
    await givenXStoredCards(3)
    await givenAStoredCardFromUser(user)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@real-username, non-existing-label'
    })
    assert.is(result.data!.length, 0)
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
    assert.is(result.data!.length, 1)
})

userSearchesForCards('given 1 coincident private cards, ' +
    'when a user with permissions to get private cards from others, searches by author, ' +
    'then return a Result with with a one item array as data and null as error', async () => {
    const requester = await givenAStoredUserWithPermissions(['GET_PRIVATE_CARD_FROM_OTHER'])
    const user = new UserBuilder().setUsername('the-username').buildDto()
    await givenTheStoredUser(user)
    const card = await givenAStoredPrivateCardFromUser(user)
    const result = await new UserSearchesForCardsUseCase().execute({
        requesterId: requester.id,
        query: '@' + user.username
    })
    assert.is(result.data!.length, 1)
    assert.equal(result.data![0], card)
})

userSearchesForCards('given 1 private card and 1 public card from the same author ' +
    'when the author without permissions to get private cards from others, searches by author, ' +
    'then return a Result with the two cards array as data and null as error', async () => {
    const requester = (await givenAStoredUserWithPermissions([]))
    const privateCard = await givenAStoredPrivateCardFromUser(requester)
    const publicCard = await givenAStoredCardFromUser(requester)
    const result = await new UserSearchesForCardsUseCase().execute({
        requesterId: requester.id,
        query: '@' + requester.username
    })
    assert.equal(result.data!, [privateCard, publicCard])
    assert.is(result.data!.length, 2)
})

userSearchesForCards('given 2 private cards and 2 public cards from the same author' +
    'when a user with permissions to get private cards from others, searches by author, ' +
    'then return a Result with with a the four cards array as data and null as error', async () => {
    const requester = await givenAStoredUserWithPermissions(['GET_PRIVATE_CARD_FROM_OTHER'])
    const user = new UserBuilder().setId('real-id').setUsername('real-username').buildDto()
    await givenTheStoredUser(user)
    const privateCard1 = await givenAStoredPrivateCardFromUser(user)
    const publicCard1 = await givenAStoredCardFromUser(user)
    const privateCard2 = await givenAStoredPrivateCardFromUser(user)
    const publicCard2 = await givenAStoredCardFromUser(user)
    const result = await new UserSearchesForCardsUseCase().execute({
        requesterId: requester.id,
        query: '@' + user.username
    })
    assert.is(result.data!.length, 4)
    assert.equal(result.data!, [privateCard1, publicCard1, privateCard2, publicCard2])
})

userSearchesForCards('given 2 private cards and 2 public cards from the same author' +
    'when a user without permissions to get private cards from others, searches by author, ' +
    'then return a Result with with a the two public cards array as data and null as error', async () => {
    const requester = await givenAStoredUserWithPermissions([])
    const user = new UserBuilder().setId('real-id').setUsername('real-username').buildDto()
    await givenTheStoredUser(user)
    await givenAStoredPrivateCardFromUser(user)
    const publicCard1 = await givenAStoredCardFromUser(user)
    await givenAStoredPrivateCardFromUser(user)
    const publicCard2 = await givenAStoredCardFromUser(user)
    const result = await new UserSearchesForCardsUseCase().execute({
        requesterId: requester.id,
        query: '@' + user.username,
    })
    assert.is(result.data!.length, 2)
    assert.equal(result.data!, [publicCard1, publicCard2])
})

userSearchesForCards('given 1 coincident private cards, ' +
    'when a user without permissions to get private cards from others, searches by author, ' +
    'then return a Result with with an empty array as data and null as error', async () => {
    const requester = await givenAStoredUserWithPermissions([])
    const user = new UserBuilder().setId('real-id').setUsername('real-username').buildDto()
    await givenTheStoredUser(user)
    await givenAStoredPrivateCardFromUser(user)
    const result = await new UserSearchesForCardsUseCase().execute({
        requesterId: requester.id,
        query: '@' + user.username,
    })
    assert.is(result.data!.length, 0)
})

userSearchesForCards('given 1 coincident private cards, ' +
    'when an anonymous user, searches by author, ' +
    'then return a Result empty array as data and null as error', async () => {
    const user = new UserBuilder().setId('real-id').setUsername('real-username').buildDto()
    await givenTheStoredUser(user)
    await givenAStoredPrivateCardFromUser(user)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@' + user.username,
    })
    assert.is(result.data!.length, 0)
})

userSearchesForCards('given 1 coincident private card and 2 public cards, ' +
    'when an anonymous user, searches by author, ' +
    'then return a Result with the public cards as array data and null as error', async () => {
    const user = new UserBuilder().setUsername('real-username').buildDto()
    await givenTheStoredUser(user)
    const cardToFind1 = await givenAStoredCardFromUser(user)
    await givenAStoredPrivateCardFromUser(user)
    const cardToFind2 = await givenAStoredCardFromUser(user)
    const result = await new UserSearchesForCardsUseCase().execute({
        query: '@' + user.username
    })
    assert.is(result.data!.length, 2)
    assert.equal(result.data!, [cardToFind1, cardToFind2])
})

userSearchesForCards('given 2 private cards and 2 public cards with the same labels ' +
    'when another user with permissions to get private cards from others, searches by label, ' +
    'then return a Result with with a the four cards array as data and null as error', async () => {
    const requester = await givenAStoredUserWithPermissions(['GET_PRIVATE_CARD_FROM_OTHER'])
    const label = 'label1'
    const privateCard1 = await givenAStoredPrivateCardWithLabels(label)
    const publicCard1 = await givenAStoredCardWithLabels(label)
    const privateCard2 = await givenAStoredPrivateCardWithLabels(label)
    const publicCard2 = await givenAStoredCardWithLabels(label)
    const result = await new UserSearchesForCardsUseCase().execute({
        requesterId: requester.id,
        query: label,
    })
    assert.equal(result.data!, [privateCard1, publicCard1, privateCard2, publicCard2])
    assert.is(result.data!.length, 4)
})

userSearchesForCards('given 2 private cards and 2 public cards with the same label ' +
    'when another user without permissions searches by label, ' +
    'then return a Result with with a the two public cards array as data and null as error', async () => {
    const requester = await givenAStoredUserWithPermissions([])
    const label = 'label1'
    await givenAStoredPrivateCardWithLabels(label)
    const publicCard1 = await givenAStoredCardWithLabels(label)
    await givenAStoredPrivateCardWithLabels(label)
    const publicCard2 = await givenAStoredCardWithLabels(label)
    const result = await new UserSearchesForCardsUseCase().execute({
        requesterId: requester.id,
        query: label,
    })
    assert.equal(result.data!, [publicCard1, publicCard2])
    assert.is(result.data!.length, 2)
})

userSearchesForCards.run()
