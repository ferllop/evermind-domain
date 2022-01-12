import {assert, suite} from '../../../test-config.js'
import { Datastore } from '../../../../src/domain/shared/Datastore.js'
import { InMemoryDatastore } from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

let sutDatastore: Datastore

const datastoreFinder = suite('In-memory datastore finder')

datastoreFinder.before.each(async () => {
    sutDatastore = new InMemoryDatastore()
    await sutDatastore.clean()
})

datastoreFinder('should return an empty array where there are no coincidences', async () => {
    const table = 'aTable'
    await sutDatastore.create(table, {id: 'a'})
    const result = await sutDatastore.findMany('aTable', () => false)
    assert.is(result.length, 0)
})

datastoreFinder('should return an array whith one coincidence', async () => {
    const table = 'aTable'
    await sutDatastore.create(table, {id: 'a', data: 'thing'})
    const result = await sutDatastore.findMany('aTable', (row: any) => row.data === 'thing')
    assert.is(result.length, 1)
})

datastoreFinder('should return an array whith all the coincidences', async () => {
    const table = 'aTable'
    const dtoA = {id: 'a', label: 'labelA'}
    const dtoB = {id: 'b', label: 'labelA'}
    const dtoC = {id: 'c', label: 'labelB'}
    await sutDatastore.create(table, dtoA)
    await sutDatastore.create(table, dtoB)
    await sutDatastore.create(table, dtoC)
    const result = await sutDatastore.findMany('aTable', (row: any) => row.label === 'labelA')
    assert.is(result.length, 2)
    assert.ok(result.some(dto => dto.id === 'a') && result.some(dto => dto.id === 'b') && !result.some(dto => dto.id === 'c'))
})

datastoreFinder.run()
