import { PreconditionError } from 'preconditions'
import { InMemoryDatastore } from '../../../src/storage/datastores/InMemoryDatastore.js'
import { assert, suite } from '../../test-config.js'

const datastore = suite('Datastore')

let sutDatastore
datastore.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})

datastore('should be capable of clean itself', () => {

    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('a-table', dto)
    sutDatastore.clean()
    assert.not.ok(sutDatastore.hasTable('a-table'))
})

datastore.run()

const datastoreCreating = suite('InMemory Datastore When Creating')

datastoreCreating.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})

datastoreCreating('should require a dto with an id property when storing', () => {
    const dto = { data: 'someData' }
    assert.throws(
        () => sutDatastore.create('a-table', dto),
        error => error instanceof PreconditionError)
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

datastoreRetrieving('should require a neither empty, undefined nor null id when retrieving', () => {
    const emptyID = ''
    assert.throws(
        () => sutDatastore.read('a-table', emptyID),
        error => error instanceof PreconditionError)

    const undefinedID = undefined
    assert.throws(
        () => sutDatastore.read('a-table', undefinedID),
        error => error instanceof PreconditionError)

    const nullID = null
    assert.throws(
        () => sutDatastore.read('a-table', nullID),
        error => error instanceof PreconditionError)
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
        error => error instanceof PreconditionError)
})

datastoreRetrieving.run()

const datastoreUpdating = suite('InMemory When Updating')
datastoreUpdating.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})
datastoreUpdating('should require a dto with an id property when updating', () => {
    const dto = { id: 'anID', data: 'someData' }
    sutDatastore.create('aTable', dto)
    delete dto.id
    assert.throws(
        () => sutDatastore.update('aTable', dto),
        error => error instanceof PreconditionError)
})

datastoreUpdating('should return true when updating a dto with an id property', () => {
    const dto = { id: 'anID', data: 'someData' }
    sutDatastore.create('aTable', dto)
    const updatedDto = {...dto, data: 'otherData'}
    assert.ok(sutDatastore.update('aTable', dto))
})

datastoreUpdating('should update a dto with an id property', () => {
    const dto = { id: 'anId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    const updatedDto = {...dto, data: 'otherData'}
    sutDatastore.update('aTable', updatedDto)
    assert.is(sutDatastore.read('aTable', dto.id).data, updatedDto.data)
})

datastoreUpdating('should maintain data of a created a dto that is not present in the update dto data', () => {
    const dto = { id: 'anId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    const updatedDto = {id: dto.id, extraData: 'otherData'}
    sutDatastore.update('aTable', updatedDto)
    assert.is(sutDatastore.read('aTable', dto.id).data, dto.data)
    assert.is(sutDatastore.read('aTable', dto.id).extraData, updatedDto.extraData)
})

datastoreUpdating('should require to update into an existing table', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    const updatedDto = {id: dto.id, data: 'otherData'}
    assert.throws(() => sutDatastore.update('unexistingTable', dto.id),
        error => error instanceof PreconditionError)
})
datastoreUpdating.run()


const datastoreDeleting = suite('InMemory When Deleting')
datastoreDeleting.before.each( () => {
    sutDatastore = new InMemoryDatastore()
})
datastoreDeleting('should require a neither empty, undefined nor null id when deleting', () => {
    const emptyID = ''
    assert.throws(
        () => sutDatastore.delete('a-table', emptyID),
        error => error instanceof PreconditionError)

    const undefinedID = undefined
    assert.throws(
        () => sutDatastore.delete('a-table', undefinedID),
        error => error instanceof PreconditionError)

    const nullID = null
    assert.throws(
        () => sutDatastore.delete('a-table', nullID),
        error => error instanceof PreconditionError)
})

datastoreDeleting('should require to delete from an existing table', () => {
    const dto = { id: 'someId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    assert.throws(() => sutDatastore.delete('unexistingTable', 'someID'),
        error => error instanceof PreconditionError)
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

datastoreDeleting('should maintain data of a created a dto that is not present in the update dto data', () => {
    const dto = { id: 'anId', data: 'someData' }
    sutDatastore.create('aTable', dto)
    const updatedDto = {id: dto.id, extraData: 'otherData'}
    sutDatastore.update('aTable', updatedDto)
    assert.is(sutDatastore.read('aTable', dto.id).data, dto.data)
    assert.is(sutDatastore.read('aTable', dto.id).extraData, updatedDto.extraData)
})

datastoreDeleting.run()

