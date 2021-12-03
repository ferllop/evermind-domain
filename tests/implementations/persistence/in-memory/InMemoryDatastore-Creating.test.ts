import { InMemoryDatastore } from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { PreconditionError } from '../../../../src/implementations/preconditions.js'
import { Datastore } from '../../../../src/domain/Datastore.js'
import { assert, suite } from '../../../test-config.js'

const datastoreCreating = suite('InMemory Datastore When Creating')

let sutDatastore: Datastore

datastoreCreating.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})

datastoreCreating('should require a dto with an id property when creating', async () => {
    const dto = {id: '', data: 'someData'}
    try {
        await sutDatastore.create('aTable', dto)
        assert.unreachable()
    } catch (error) {
        assert.instance(error, PreconditionError)
    }
})

datastoreCreating('should return true when storing a dto with an id property', async () => {
    const dto = { id: 'someId', data: 'someData' }
    assert.equal(await sutDatastore.create('a-table', dto), true)
})

datastoreCreating('should store a dto with an id property', async() => {
    const dto = { id: 'someId', data: 'someData' }
    await sutDatastore.create('a-table', dto)
    assert.is(await sutDatastore.read('a-table', dto.id), dto)
})

datastoreCreating('should return false when duplicating an entity', async () => {
    const dto = { id: 'someId', data: 'someData' }
    await sutDatastore.create('a-table', dto)
    const result = await sutDatastore.create('a-table', dto)
    assert.is(result, false)
})

datastoreCreating('should not modify the stored entity when duplicating the storage', async () => {
    const table = 'aTable'
    const dto = { id: 'theId', data: 'firstData' }
    await sutDatastore.create(table, dto)
    await sutDatastore.create(table, { ...dto, data: 'modified' })
    assert.equal(await sutDatastore.read(table, dto.id), dto)
})

datastoreCreating.run()

