import {Datastore} from '../../../../src/models/Datastore.js'
import {assert, suite} from '../../../test-config.js'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/NewInMemoryDatastore.js'

const datastore = suite('New in-memory datastore')

let sutDatastore: Datastore

datastore.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})

datastore('should be capable of clean itself', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create<typeof dto>('a-table', dto)
    sutDatastore.clean()
    assert.not.ok(sutDatastore.hasTable('a-table'))
})

datastore.run()

