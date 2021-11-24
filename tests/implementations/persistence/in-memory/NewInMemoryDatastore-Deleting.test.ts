import {PreconditionError} from '../../../../src/implementations/preconditions.js'
import {Datastore} from '../../../../src/models/Datastore.js'
import {assert, suite} from '../../../test-config.js'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/NewInMemoryDatastore.js'

let sutDatastore: Datastore

const datastoreDeleting = suite('New in-memory datastore when deleting')

datastoreDeleting.before.each(() => {
    sutDatastore = new InMemoryDatastore()
})

datastoreDeleting('should require a non empty id when deleting', () => {
    const emptyID = ''
    assert.throws(
        () => sutDatastore.delete('a-table', emptyID),
        (error: Error) => error instanceof PreconditionError)
})

datastoreDeleting('should require to delete from an existing table', () => {
    const dto = {id: 'someId', data: 'someData'}
    sutDatastore.create('aTable', dto)
    assert.throws(() => sutDatastore.delete('unexistingTable', 'someID'),
        (error: Error) => error instanceof PreconditionError)
})

datastoreDeleting('should return true when deleting from an id', () => {
    const id = 'anID'
    const dto = {id, data: 'someData'}
    sutDatastore.create('aTable', dto)
    assert.ok(sutDatastore.delete('aTable', id))
})

datastoreDeleting('should delete a dto with given an id', () => {
    const id = 'anID'
    const dto = {id, data: 'someData'}
    sutDatastore.create('aTable', dto)
    sutDatastore.delete('aTable', id)
    assert.is(sutDatastore.read('aTable', id), null)
})

datastoreDeleting.run()
