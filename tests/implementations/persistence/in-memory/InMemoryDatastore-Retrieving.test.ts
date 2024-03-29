import {PreconditionError} from '../../../../src/implementations/preconditions.js'
import {assert, suite} from '../../../test-config.js'
import { InMemoryDatastore } from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

let sutDatastore: InMemoryDatastore

const datastoreRetrieving = suite('In-memory datastore when retrieving')

datastoreRetrieving.before.each(async () => {
    sutDatastore = new InMemoryDatastore()
    await sutDatastore.clean()
})

datastoreRetrieving('should not permit empty id when retrieving', async () => {
    const dto = {id: 'someId', data: 'someData'}
    await sutDatastore.create('a-table', dto)
    try {
        const emptyId = ''
        await sutDatastore.read('a-table', emptyId)
        assert.unreachable()
    } catch (error) {
        assert.instance(error, PreconditionError)
    }
})

datastoreRetrieving('should return a dto when reading an existing id', async () => {
    const dto = {id: 'someId', data: 'someData'}
    await sutDatastore.create('a-table', dto)
    assert.is(await sutDatastore.read('a-table', dto.id), dto)
})

datastoreRetrieving('should return null when reading a not existing id', async () => {
    const dto = {id: 'someId', data: 'someData'}
    await sutDatastore.create('aTable', dto)
    assert.equal(await sutDatastore.read('aTable', 'non-existingID'), null)
})

datastoreRetrieving('should require to read into an existing table', async () => {
    try {
        await sutDatastore.read('non-existingTable', 'someID')
        assert.unreachable()
    } catch (error) {
        assert.instance(error, PreconditionError)
    }
})

datastoreRetrieving.run()
