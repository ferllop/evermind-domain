import {PreconditionError} from '../../../../src/implementations/preconditions.js'
import {assert, suite} from '../../../test-config.js'
import { Datastore } from '../../../../src/domain/shared/Datastore.js'
import { InMemoryDatastore } from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

let sutDatastore: Datastore

const datastoreUpdating = suite('In-memory datastore when updating')

datastoreUpdating.before.each(() => {
    sutDatastore = new InMemoryDatastore()
})

datastoreUpdating('should require a dto with an id property when updating', async () => {
    const dto = {id: 'anID', data: 'someData'}
    await sutDatastore.create('aTable', dto)
    try {
        dto.id = ''
        await sutDatastore.update('aTable', dto)
        assert.unreachable()
    } catch (error) {
        assert.instance(error, PreconditionError)
    }
})

datastoreUpdating('should return true when updating a dto with an id property', async () => {
    const dto = {id: 'anID', data: 'someData'}
    await sutDatastore.create('aTable', dto)
    assert.ok(await sutDatastore.update('aTable', dto))
})

datastoreUpdating('should update a dto with an id property', async () => {
    const dto = {id: 'anId', data: 'someData'}
    await sutDatastore.create('aTable', dto)
    const updatedDto = {...dto, data: 'otherData'}
    await sutDatastore.update('aTable', updatedDto)
    assert.is((await sutDatastore.read<typeof dto>('aTable', dto.id))?.data, updatedDto.data)
})

datastoreUpdating('should maintain data of a created a dto that is not present in the update dto data', async () => {
    const dto = {id: 'anId', data: 'someData'}
    await sutDatastore.create<typeof dto>('aTable', dto)
    const updatedDto = {id: dto.id, extraData: 'otherData'}
    await sutDatastore.update('aTable', updatedDto)
    assert.is((await sutDatastore.read<typeof dto>('aTable', dto.id))?.data, dto.data)
    assert.is((await sutDatastore.read<typeof updatedDto>('aTable', dto.id))?.extraData, updatedDto.extraData)
})

datastoreUpdating('should require to update into an existing table', async () => {
    const dto = {id: 'someId', data: 'someData'}
    await sutDatastore.create('aTable', dto)
    try {
        await sutDatastore.update('unexistingTable', dto)
        assert.unreachable()
    } catch (error) {
        assert.instance(error, PreconditionError)
    }
})
datastoreUpdating.run()
