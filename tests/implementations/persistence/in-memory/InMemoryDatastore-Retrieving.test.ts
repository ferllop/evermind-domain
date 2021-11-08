import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {PreconditionError} from '../../../../src/implementations/preconditions.js'
import {Datastore} from '../../../../src/models/Datastore.js'
import {assert, suite} from '../../../test-config.js'

let sutDatastore: Datastore

const datastoreRetrieving = suite('InMemory Datastore When Retrieving')

datastoreRetrieving.before.each(() => {
    sutDatastore = new InMemoryDatastore()
})

datastoreRetrieving('should require a not empty id when retrieving', () => {
    const emptyID = ''
    assert.throws(
        () => sutDatastore.read('a-table', emptyID),
        (error: Error) => error instanceof PreconditionError)
})

datastoreRetrieving('should return a dto when reading an existing id', () => {
    const dto = {id: 'someId', data: 'someData'}
    sutDatastore.create('a-table', dto)
    assert.is(sutDatastore.read('a-table', dto.id), dto)
})

datastoreRetrieving('should return null when reading a not existing id', () => {
    const dto = {id: 'someId', data: 'someData'}
    sutDatastore.create('aTable', dto)
    assert.equal(sutDatastore.read('aTable', 'unexistingID'), null)
})

datastoreRetrieving('should require to read into an existing table', () => {
    const dto = {id: 'someId', data: 'someData'}
    sutDatastore.create('aTable', dto)
    assert.throws(() => sutDatastore.read('unexistingTable', 'someID'),
        (error: Error) => error instanceof PreconditionError)
})

datastoreRetrieving.run()
