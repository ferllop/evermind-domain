import { PreconditionError } from '../../../src/lib/preconditions.js'
import { Datastore } from '../../../src/models/Datastore.js'
import { InMemoryDatastore } from '../../../src/storage/datastores/InMemoryDatastore.js'
import { assert, suite } from '../../test-config.js'

const datastore = suite('Datastore')

let sutDatastore: Datastore
datastore.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})

datastore('should not bebe capable of clean itself', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create<typeof dto>('a-table', dto)
    sutDatastore.clean()
    assert.not.ok(sutDatastore.hasTable('a-table'))
})

datastore.run()

const datastoreCreating = suite('InMemory Datastore When Creating')

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

datastoreCreating.run()

const datastoreRetrieving = suite('InMemory Datastore When Retrieving')

datastoreRetrieving.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})

datastoreRetrieving('should require a not empty id when retrieving', () => {
    const emptyID = ''
    assert.throws(
        () => sutDatastore.read('a-table', emptyID),
        (error: Error) => error instanceof PreconditionError)
})

datastoreRetrieving('should return a dto when reading an existing id', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('a-table', dto)
    assert.is(sutDatastore.read('a-table', dto.id), dto)
})

datastoreRetrieving('should return null when reading a not existing id', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    assert.equal(sutDatastore.read('aTable', 'unexistingID'), null)
})

datastoreRetrieving('should require to read into an existing table', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    assert.throws(() => sutDatastore.read('unexistingTable', 'someID'),
        (error: Error) => error instanceof PreconditionError)
})

datastoreRetrieving.run()

const datastoreUpdating = suite('InMemory When Updating')
datastoreUpdating.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})
datastoreUpdating('should require a dto with an id property when updating', () => {
    const dto = { id: 'anID', data: 'someData' }
    sutDatastore.create('aTable', dto)
    dto.id = ''
    assert.throws(
        () => sutDatastore.update('aTable', dto),
        (error: Error) => error instanceof PreconditionError)
})

datastoreUpdating('should return true when updating a dto with an id property', () => {
    const dto = { id: 'anID', data: 'someData' }
    sutDatastore.create('aTable', dto)
    assert.ok(sutDatastore.update('aTable', dto))
})

datastoreUpdating('should update a dto with an id property', () => {
    const dto = { id: 'anId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    const updatedDto = {...dto, data: 'otherData'}
    sutDatastore.update('aTable', updatedDto)
    assert.is(sutDatastore.read<typeof dto>('aTable', dto.id)?.data, updatedDto.data)
})

datastoreUpdating('should maintain data of a created a dto that is not present in the update dto data', () => {
    const dto = { id: 'anId', data: 'someData' }
    sutDatastore.create<typeof dto>('aTable', dto)
    const updatedDto = {id: dto.id, extraData: 'otherData'}
    sutDatastore.update('aTable', updatedDto)
    assert.is(sutDatastore.read<typeof dto>('aTable', dto.id)?.data, dto.data)
    assert.is(sutDatastore.read<typeof updatedDto>('aTable', dto.id)?.extraData, updatedDto.extraData)
})

datastoreUpdating('should require to update into an existing table', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    assert.throws(() => sutDatastore.update('unexistingTable', dto),
        (error: Error) => error instanceof PreconditionError)
})
datastoreUpdating.run()


const datastoreDeleting = suite('InMemory When Deleting')
datastoreDeleting.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})
datastoreDeleting('should require a non empty id when deleting', () => {
    const emptyID = ''
    assert.throws(
        () => sutDatastore.delete('a-table', emptyID),
        (error: Error) => error instanceof PreconditionError)
})

datastoreDeleting('should require to delete from an existing table', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    assert.throws(() => sutDatastore.delete('unexistingTable', 'someID'),
        (error: Error) => error instanceof PreconditionError)
})

datastoreDeleting('should return true when deleting from an id', () => {
    const id = 'anID'
    const dto = { id, data: 'someData' }
    sutDatastore.create('aTable', dto)
    assert.ok(sutDatastore.delete('aTable', id))
})

datastoreDeleting('should delete a dto with given an id', () => {
    const id = 'anID'
    const dto = { id, data: 'someData' }
    sutDatastore.create('aTable', dto)
    sutDatastore.delete('aTable', id)
    assert.is(sutDatastore.read('aTable', id), null)
})

datastoreDeleting.run()

const datastoreFinder = suite('Datastore Finder')

datastoreFinder.before.each(() => {
    sutDatastore = new InMemoryDatastore()
})

datastoreFinder('should return an empty array where there are no coincidences', () => {
    const table = 'aTable'
    sutDatastore.create(table, {id:'a'})
    const result = sutDatastore.find('aTable', () => false)
    assert.is(result.length, 0)
})

datastoreFinder('should return an array whith one coincidence', () => {
    const table = 'aTable'
    sutDatastore.create(table, {id:'a', data: 'thing'})
    const result = sutDatastore.find('aTable', (row: any) => row.data === 'thing')
    assert.is(result.length, 1)
})

datastoreFinder('should return an array whith all the coincidences', () => {
    const table = 'aTable'
    const dtoA = {id:'a', label: 'labelA'}
    const dtoB = {id:'b', label: 'labelA'}
    const dtoC = {id:'c', label: 'labelB'}
    sutDatastore.create(table, dtoA)
    sutDatastore.create(table, dtoB)
    sutDatastore.create(table, dtoC)
    const result = sutDatastore.find('aTable', (row: any) => row.label === 'labelA')
    assert.is(result.length, 2)
    assert.ok(result.some(dto => dto.id === 'a') && result.some(dto => dto.id === 'b') && !result.some(dto => dto.id === 'c'))
})

datastoreFinder.run()
