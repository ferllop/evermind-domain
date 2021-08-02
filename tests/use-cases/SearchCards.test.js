import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { CardMother } from '../models/card/CardMother.js'
import { LabellingMother } from '../models/card/LabellingMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const searchCard = suite('SearchCards UseCase')

/** @type {Datastore} */
let datastore
searchCard.before.each(() => {
    datastore = new InMemoryDatastore()
})
searchCard('having 0 coincident cards, return a Result with empty array as data and null as error', () => {
    new DatastoreMother(CardMother, datastore).having(3).storedIn()
    const nonExistingLabelQuery = 'non-existing'
    const result = new SearchCardsUseCase(datastore).execute({query: nonExistingLabelQuery})
})

/*
having 0, 1 and 2 coincident cards by label return a Result with an empty, 1 and 2 cards list when searching by labels
return a Result with a list of found cards when searching by labels
return a Result with an empty list when searching by non-existent author
*/
