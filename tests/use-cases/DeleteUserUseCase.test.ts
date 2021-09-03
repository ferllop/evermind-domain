import { UserDto } from '../../src/models/user/UserDto.js'
import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { DeleteUserUseCase } from '../../src/use-cases/DeleteUserUseCase.js'
import { UserMother } from '../models/user/UserMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const deleteUser = suite("DeleteUser UseCase")

let datastore: Datastore
let datastoreMother: DatastoreMother<UserDto>

deleteUser.before.each(() => {
    datastore = new InMemoryDatastore()
    datastoreMother = new DatastoreMother(new UserMother(), datastore)
})

deleteUser(
    'given an existing user id, ' +
    'should return an object with either ' +
    'data and error properties as null', () => {
        datastoreMother.having(1).storedIn()
        const result = new DeleteUserUseCase().execute(IdentificationMother.numberedDto(1), datastore)
        assert.ok(ResultMother.isEmptyOk(result))
    })

deleteUser('given an existing user id, should remove it', () => {
    datastoreMother.having(1).storedIn()
    assert.ok(datastoreMother.exists(1))
    new DeleteUserUseCase().execute(IdentificationMother.numberedDto(1), datastore)
    assert.not.ok(datastoreMother.exists(1))
})

deleteUser(
    'given an unexisting user id into an existing users table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        datastoreMother.having(1).storedIn()
        const result = new DeleteUserUseCase().execute({ id: 'unexistingID' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

deleteUser(
    'given an unexisting table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        const result = new DeleteUserUseCase().execute({ id: 'unexistingIDnorTable' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

deleteUser(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new DeleteUserUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

deleteUser.run()
