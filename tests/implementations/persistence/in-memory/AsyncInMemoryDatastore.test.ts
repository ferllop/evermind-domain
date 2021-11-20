import { AsyncInMemoryDatastore } from '../../../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'
import { AsyncDatastore } from '../../../../src/models/AsyncDatastore.js'
import { assert, suite } from '../../../test-config.js'

type Context = {
    datastore: AsyncDatastore
}

const datastore = suite<Context>('Async In-Memory Datastore')


datastore.before.each( context => {
    context.datastore = new AsyncInMemoryDatastore()
})

datastore('should be capable of clean itself', async ({datastore}) => {
    const dto = { id: 'someId', data: 'someData' }
    await datastore.create('a-table', dto)
    await datastore.clean()
    assert.equal(await datastore.hasTable('a-table'), false)
})

datastore.run()

