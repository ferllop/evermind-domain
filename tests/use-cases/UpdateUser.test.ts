import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { UpdateUserUseCase } from '../../src/use-cases/UpdateUser.js'
import { UserMother } from '../models/user/UserMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const updateUser = suite("Update User UseCase")

let datastore: Datastore
updateUser.before.each(() => {
    datastore = new InMemoryDatastore()
})

updateUser(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UpdateUserUseCase().execute(new UserMother().dto(), datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

updateUser(
    'given a previously stored user and data to update it, ' +
    'the user should be updated in storage', () => {
        const dsMother = new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const newAuthId = 'newAuthId'
        new UpdateUserUseCase().execute({ ...new UserMother().numberedDto(1), authId: newAuthId }, datastore)
        assert.ok(dsMother.stored(1).hasPropertyValue('authId', newAuthId))
    })

updateUser(
    'given a previously stored user and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', () => {
        new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = new UpdateUserUseCase().execute({ ...new UserMother().numberedDto(1), authId: 'updatedAuthId' }, datastore)
        assert.ok(ResultMother.isEmptyOk(result))
    })

updateUser(
    'given an unexisting user in an existing table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = new UpdateUserUseCase().execute({ ...new UserMother().numberedDto(1), id: 'notExistingId' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

updateUser(
    'given wrong user data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UpdateUserUseCase().execute(new UserMother().invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

updateUser.run()
