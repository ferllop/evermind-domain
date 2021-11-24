import { Datastore } from '../../src/models/Datastore.js'
import { CardMother } from '../models/card/CardMother.js'
import { assert, suite } from '../test-config.js'
import { UserSearchesForCardsUseCase } from '../../src/use-cases/UserSearchesForCardsUseCase.js'
import { UserMother } from '../models/user/UserMother.js'
import { DatastoreMother } from '../models/DatastoreMother.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

const userSearchesForCards = suite('User searches for cards use case')

const cardMother = new CardMother()

let datastore: Datastore
userSearchesForCards.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
})

userSearchesForCards('having 0 coincident cards, return a Result with empty array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: 'non-existing'})
    assert.is(result.data.length, 0)
})

userSearchesForCards('having three cards, with one coincident card, return a Result with a one element array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: 'label0ofcard1'})
    assert.is(result.data.length, 1)
})

userSearchesForCards('having three cards, with one partial card, return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: 'label0ofcard1, otherlabel'})
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 3 cards stored, two of them with same labels, return a Result with a two elements array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    datastore.update(cardMother.TABLE_NAME, { id: 'the-id2', labelling:['label0ofcard1']})
    const result = new UserSearchesForCardsUseCase().execute({query: 'label0ofcard1'})
    assert.is(result.data.length, 2)
})

userSearchesForCards('having 1 card with two coincident labels, return a Result with one element array as data and null as error', () => {
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    datastore.update(cardMother.TABLE_NAME, { id: 'the-id1', labelling:['label0ofcard1', 'label0ofcard2']})
    const result = new UserSearchesForCardsUseCase().execute({query: 'label0ofcard1, label0ofcard2'})
    assert.is(result.data.length, 1)
})

userSearchesForCards('having 0 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: '@non-existing-author'})
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: '@validUsername1'})
    assert.is(result.data.length, 1)
})

userSearchesForCards('having 0 coincident cards, when searching by author and label, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: '@validUsername1, non-existing-label'})
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author and label, then return a Result with a one elemnt array as data and null as error', () => {
    new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
    new DatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = new UserSearchesForCardsUseCase().execute({query: '@validUsername1, label0ofCard1'})
    assert.is(result.data.length, 1)
})

userSearchesForCards.run()
