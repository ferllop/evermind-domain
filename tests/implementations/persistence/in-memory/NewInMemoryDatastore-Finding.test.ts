import {Datastore} from '../../../../src/models/Datastore.js'
import {assert, suite} from '../../../test-config.js'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

let sutDatastore: Datastore

const datastoreFinder = suite('New in-memory datastore finder')

datastoreFinder.before.each(() => {
    sutDatastore = new InMemoryDatastore()
})

datastoreFinder('should return an empty array where there are no coincidences', () => {
    const table = 'aTable'
    sutDatastore.create(table, {id: 'a'})
    const result = sutDatastore.findMany('aTable', () => false)
    assert.is(result.length, 0)
})

datastoreFinder('should return an array whith one coincidence', () => {
    const table = 'aTable'
    sutDatastore.create(table, {id: 'a', data: 'thing'})
    const result = sutDatastore.findMany('aTable', (row: any) => row.data === 'thing')
    assert.is(result.length, 1)
})

datastoreFinder('should return an array whith all the coincidences', () => {
    const table = 'aTable'
    const dtoA = {id: 'a', label: 'labelA'}
    const dtoB = {id: 'b', label: 'labelA'}
    const dtoC = {id: 'c', label: 'labelB'}
    sutDatastore.create(table, dtoA)
    sutDatastore.create(table, dtoB)
    sutDatastore.create(table, dtoC)
    const result = sutDatastore.findMany('aTable', (row: any) => row.label === 'labelA')
    assert.is(result.length, 2)
    assert.ok(result.some(dto => dto.id === 'a') && result.some(dto => dto.id === 'b') && !result.some(dto => dto.id === 'c'))
})

datastoreFinder.run()
