import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { CardMother } from '../models/card/CardMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'
import { SearchCardsUseCase } from '../../src/use-cases/SearchCards.js'
import { Response } from '../../src/models/value/Response.js'

const searchCard = suite('SearchCards UseCase')

let datastore: Datastore
searchCard.before.each(() => {
    datastore = new InMemoryDatastore()
})

searchCard('having 0 coincident cards, return a Result with empty array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result = new SearchCardsUseCase().execute({query: 'non-existing'}, datastore)
    assert.is((result.data as object[])?.length, 0)
})

searchCard('having 1 coincident cards, return a Result with a one element array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result: Response = new SearchCardsUseCase().execute({query: 'label0ofcard1'}, datastore)
    assert.is((result.data as object[])?.length, 1)
})

searchCard('having 2 coincident cards, return a Result with a two elements array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result: Response = new SearchCardsUseCase().execute({query: 'label0ofcard1, label0ofcard2'}, datastore)
    assert.is((result.data as object[])?.length, 2)
})

searchCard('having 0 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result: Response = new SearchCardsUseCase().execute({query: '@author'}, datastore)
    assert.is((result.data as object[])?.length, 0)
})

searchCard('having 1 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const result: Response = new SearchCardsUseCase().execute({query: '@authorID1'}, datastore)
    assert.is((result.data as object[])?.length, 1)
})
/*
return a Result with a list of found cards when searching by labels
return a Result with an empty list when searching by non-existent author
*/
searchCard.run()
