import {PreconditionError} from '../../../../src/implementations/preconditions.js'
import {assert, suite} from '../../../test-config.js'
import { AsyncDatastore } from '../../../../src/models/AsyncDatastore.js'
import { AsyncInMemoryDatastore } from '../../../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'

let sutDatastore: AsyncDatastore

const datastoreDeleting = suite('In-memory datastore when deleting')

datastoreDeleting.before.each(() => {
    sutDatastore = new AsyncInMemoryDatastore()
})

datastoreDeleting('should require a dto with an id property when deleting', async () => {
    const dto = {id: 'someId', data: 'someData'}
    await sutDatastore.create('aTable', dto)
    try {
        await sutDatastore.delete('aTable', '')
        assert.unreachable()
    } catch (error) {
        assert.instance(error, PreconditionError)
    }
})

datastoreDeleting('should require to delete from an existing table', async () => {
    const dto = {id: 'someId', data: 'someData'}
    await sutDatastore.create('aTable', dto)
    try {
        await sutDatastore.delete('unexistingTable', 'someID')
        assert.unreachable()
    } catch (error) {
        assert.instance(error, PreconditionError)
    }
})

datastoreDeleting('should return true when deleting from an id', async () => {
    const id = 'anID'
    const dto = {id, data: 'someData'}
    await sutDatastore.create('aTable', dto)
    assert.ok(await sutDatastore.delete('aTable', id))
})

datastoreDeleting('should delete a dto with given an id', async () => {
    const id = 'anID'
    const dto = {id, data: 'someData'}
    await sutDatastore.create('aTable', dto)
    await sutDatastore.delete('aTable', id)
    assert.is(await sutDatastore.read('aTable', id), null)
})

datastoreDeleting.run()
