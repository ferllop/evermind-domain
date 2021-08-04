import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { CardMother } from '../models/card/CardMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'
import { SearchCardsUseCase } from '../../src/use-cases/SearchCards.js'
import { UserMother } from '../../tests/models/user/UserMother.js'

const searchCard = suite('SearchCards UseCase')

let datastore: Datastore
searchCard.before.each(() => {
    datastore = new InMemoryDatastore()
})

searchCard('having 0 coincident cards, return a Result with empty array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result = new SearchCardsUseCase().execute({query: 'non-existing'}, datastore)
    assert.is(result.data.length, 0)
})

searchCard('having three cards, with one coincident card, return a Result with a one element array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result = new SearchCardsUseCase().execute({query: 'label0ofcard1'}, datastore)
    assert.is(result.data.length, 1)
})

searchCard('having three cards, with one partial card, return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result = new SearchCardsUseCase().execute({query: 'label0ofcard1, otherlabel'}, datastore)
    assert.is(result.data.length, 0)
})

searchCard('having 3 cards stored, two of them with same labels, return a Result with a two elements array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    datastore.update(CardMother.TABLE_NAME, { id: 'the-id2', labelling:['label0ofcard1']})
    const result = new SearchCardsUseCase().execute({query: 'label0ofcard1'}, datastore)
    assert.is(result.data.length, 2)
})

searchCard('having 1 card with two coincident labels, return a Result with one element array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    datastore.update(CardMother.TABLE_NAME, { id: 'the-id1', labelling:['label0ofcard1', 'label0ofcard2']})
    const result = new SearchCardsUseCase().execute({query: 'label0ofcard1, label0ofcard2'}, datastore)
    assert.is(result.data.length, 1)
})

searchCard('having 0 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(UserMother, datastore).having(1).storedIn()
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result = new SearchCardsUseCase().execute({query: '@non-existing-author'}, datastore)
    assert.is(result.data.length, 0)
})

searchCard('having 1 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(UserMother, datastore).having(1).storedIn()
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result = new SearchCardsUseCase().execute({query: '@validUsername1'}, datastore)
    assert.is(result.data.length, 1)
})

searchCard('having 0 coincident cards, when searching by author and label, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(UserMother, datastore).having(1).storedIn()
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result = new SearchCardsUseCase().execute({query: '@validUsername1, non-existing-label'}, datastore)
    assert.is(result.data.length, 0)
})

searchCard('having 1 coincident cards, when searching by author and label, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(UserMother, datastore).having(1).storedIn()
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result = new SearchCardsUseCase().execute({query: '@validUsername1, label0ofCard1'}, datastore)
    assert.is(result.data.length, 1)
})

searchCard.run()
