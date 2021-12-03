import { InMemoryDatastore } from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { Datastore } from '../../../../src/domain/Datastore.js'
import { assert, suite } from '../../../test-config.js'

type Context = {
    datastore: Datastore
}

const datastore = suite<Context>('In-Memory Datastore')


datastore.before.each( context => {
    context.datastore = new InMemoryDatastore()
})

datastore('should be capable of clean itself', async ({datastore}) => {
    const dto = { id: 'someId', data: 'someData' }
    await datastore.create('a-table', dto)
    await datastore.clean()
    assert.equal(await datastore.hasTable('a-table'), false)
})

datastore.run()

