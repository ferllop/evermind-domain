import { UserDto } from '../../src/models/user/UserDto.js'
import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { UserRemovesAccountUseCase } from '../../src/use-cases/UserRemovesAccountUseCase.js'
import { UserMother } from '../models/user/UserMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const userRemovesAccountUseCase = suite("User removes account use case")

let datastore: Datastore
let datastoreMother: DatastoreMother<UserDto>

userRemovesAccountUseCase.before.each(() => {
    datastore = new InMemoryDatastore()
    datastoreMother = new DatastoreMother(new UserMother(), datastore)
})

userRemovesAccountUseCase(
    'given an existing user id, ' +
    'should return an object with either ' +
    'data and error properties as null', () => {
        datastoreMother.having(1).storedIn()
        const result = new UserRemovesAccountUseCase().execute(IdentificationMother.numberedDto(1), datastore)
        assert.ok(ResultMother.isEmptyOk(result))
    })

userRemovesAccountUseCase('given an existing user id, should remove it', () => {
    datastoreMother.having(1).storedIn()
    assert.ok(datastoreMother.exists(1))
    new UserRemovesAccountUseCase().execute(IdentificationMother.numberedDto(1), datastore)
    assert.not.ok(datastoreMother.exists(1))
})

userRemovesAccountUseCase(
    'given an unexisting user id into an existing users table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        datastoreMother.having(1).storedIn()
        const result = new UserRemovesAccountUseCase().execute({ id: 'unexistingID' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

userRemovesAccountUseCase(
    'given an unexisting table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UserRemovesAccountUseCase().execute({ id: 'unexistingIDnorTable' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

userRemovesAccountUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserRemovesAccountUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

userRemovesAccountUseCase.run()
