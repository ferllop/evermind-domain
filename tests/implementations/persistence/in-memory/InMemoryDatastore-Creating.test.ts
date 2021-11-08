import { InMemoryDatastore } from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { PreconditionError } from '../../../../src/implementations/preconditions.js'
import { Datastore } from '../../../../src/models/Datastore.js'
import { assert, suite } from '../../../test-config.js'

const datastoreCreating = suite('InMemory Datastore When Creating')

let sutDatastore: Datastore

datastoreCreating.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})

datastoreCreating('should require a dto with an id property when storing', () => {
    const dto = { id: '', data: 'someData' }
    assert.throws(
        () => sutDatastore.create<typeof dto>('a-table', dto),
        (error: Error) => error instanceof PreconditionError)
})

datastoreCreating('should return true when storing a dto with an id property', () => {
    const dto = { id: 'someId', data: 'someData' }
    assert.ok(sutDatastore.create('a-table', dto))
})

datastoreCreating('should store a dto with an id property', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('a-table', dto)
    assert.is(sutDatastore.read('a-table', dto.id), dto)
})

datastoreCreating('should return false when duplicating an entity', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('a-table', dto)
    const result = sutDatastore.create('a-table', dto)
    assert.not.ok(result)
})

datastoreCreating('should not modify the stored entity when duplicating the storage', () => {
    const table = 'aTable'
    const dto = { id: 'theId', data: 'firstData' }
    sutDatastore.create(table, dto)
    sutDatastore.create(table, { ...dto, data: 'modified' })
    assert.equal(sutDatastore.read(table, dto.id), dto)
})

datastoreCreating.run()

