import { Datastore } from '../../src/models/Datastore.js'
import { InMemoryDatastore } from '../../src/implementations/InMemoryDatastore.js'
import { CardMother } from '../models/card/CardMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'
import { UserSearchesForCardsUseCase } from '../../src/use-cases/UserSearchesForCardsUseCase.js'
import { UserMother } from '../../tests/models/user/UserMother.js'

const userSearchesForCards = suite('User searches for cards use case')

const cardMother = new CardMother()

let datastore: Datastore
userSearchesForCards.before.each(() => {
    datastore = new InMemoryDatastore()
})

userSearchesForCards('having 0 coincident cards, return a Result with empty array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: 'non-existing'}, datastore)
    assert.is(result.data.length, 0)
})

userSearchesForCards('having three cards, with one coincident card, return a Result with a one element array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: 'label0ofcard1'}, datastore)
    assert.is(result.data.length, 1)
})

userSearchesForCards('having three cards, with one partial card, return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: 'label0ofcard1, otherlabel'}, datastore)
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 3 cards stored, two of them with same labels, return a Result with a two elements array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    datastore.update(cardMother.TABLE_NAME, { id: 'the-id2', labelling:['label0ofcard1']})
    const result = new UserSearchesForCardsUseCase().execute({query: 'label0ofcard1'}, datastore)
    assert.is(result.data.length, 2)
})

userSearchesForCards('having 1 card with two coincident labels, return a Result with one element array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    datastore.update(cardMother.TABLE_NAME, { id: 'the-id1', labelling:['label0ofcard1', 'label0ofcard2']})
    const result = new UserSearchesForCardsUseCase().execute({query: 'label0ofcard1, label0ofcard2'}, datastore)
    assert.is(result.data.length, 1)
})

userSearchesForCards('having 0 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: '@non-existing-author'}, datastore)
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: '@validUsername1'}, datastore)
    assert.is(result.data.length, 1)
})

userSearchesForCards('having 0 coincident cards, when searching by author and label, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: '@validUsername1, non-existing-label'}, datastore)
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author and label, then return a Result with a one elemnt array as data and null as error', () => {
    new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: '@validUsername1, label0ofCard1'}, datastore)
    assert.is(result.data.length, 1)
})

userSearchesForCards.run()
