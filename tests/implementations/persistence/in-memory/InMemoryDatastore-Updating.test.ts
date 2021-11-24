import {PreconditionError} from '../../../../src/implementations/preconditions.js'
import {Datastore} from '../../../../src/models/Datastore.js'
import {assert, suite} from '../../../test-config.js'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

let sutDatastore: Datastore

const datastoreUpdating = suite('In-memory datastore when updating')

datastoreUpdating.before.each(() => {
    sutDatastore = new InMemoryDatastore()
})

datastoreUpdating('should require a dto with an id property when updating', () => {
    const dto = {id: 'anID', data: 'someData'}
    sutDatastore.create('aTable', dto)
    dto.id = ''
    assert.throws(
        () => sutDatastore.update('aTable', dto),
        (error: Error) => error instanceof PreconditionError)
})

datastoreUpdating('should return true when updating a dto with an id property', () => {
    const dto = {id: 'anID', data: 'someData'}
    sutDatastore.create('aTable', dto)
    assert.ok(sutDatastore.update('aTable', dto))
})

datastoreUpdating('should update a dto with an id property', () => {
    const dto = {id: 'anId', data: 'someData'}
    sutDatastore.create('aTable', dto)
    const updatedDto = {...dto, data: 'otherData'}
    sutDatastore.update('aTable', updatedDto)
    assert.is(sutDatastore.read<typeof dto>('aTable', dto.id)?.data, updatedDto.data)
})

datastoreUpdating('should maintain data of a created a dto that is not present in the update dto data', () => {
    const dto = {id: 'anId', data: 'someData'}
    sutDatastore.create<typeof dto>('aTable', dto)
    const updatedDto = {id: dto.id, extraData: 'otherData'}
    sutDatastore.update('aTable', updatedDto)
    assert.is(sutDatastore.read<typeof dto>('aTable', dto.id)?.data, dto.data)
    assert.is(sutDatastore.read<typeof updatedDto>('aTable', dto.id)?.extraData, updatedDto.extraData)
})

datastoreUpdating('should require to update into an existing table', () => {
    const dto = {id: 'someId', data: 'someData'}
    sutDatastore.create('aTable', dto)
    assert.throws(() => sutDatastore.update('unexistingTable', dto),
        (error: Error) => error instanceof PreconditionError)
})
datastoreUpdating.run()
