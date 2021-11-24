import { UserDto } from '../../src/models/user/UserDto.js'
import { Datastore } from '../../src/models/Datastore.js'
import { UserRemovesAccountUseCase } from '../../src/use-cases/UserRemovesAccountUseCase.js'
import { UserMother } from '../models/user/UserMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { assert, suite } from '../test-config.js'
import { Response } from '../../src/use-cases/Response.js'
import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { DatastoreMother } from '../models/DatastoreMother.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

const userRemovesAccountUseCase = suite("User removes account use case")

let datastore: Datastore
let datastoreMother: DatastoreMother<UserDto>

userRemovesAccountUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    datastoreMother = new DatastoreMother(new UserMother(), datastore)
})

userRemovesAccountUseCase(
    'given an existing user id, ' +
    'should return an object with either ' +
    'data and error properties as null', () => {
        datastoreMother.having(1).storedIn()
        const result = new UserRemovesAccountUseCase().execute(IdentificationMother.numberedDto(1))
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesAccountUseCase('given an existing user id, should remove it', () => {
    datastoreMother.having(1).storedIn()
    assert.ok(datastoreMother.exists(1))
    new UserRemovesAccountUseCase().execute(IdentificationMother.numberedDto(1))
    assert.not.ok(datastoreMother.exists(1))
})

userRemovesAccountUseCase(
    'given an unexisting user id into an existing users table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        datastoreMother.having(1).storedIn()
        const result = new UserRemovesAccountUseCase().execute({ id: 'unexistingID' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userRemovesAccountUseCase(
    'given an unexisting table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UserRemovesAccountUseCase().execute({ id: 'unexistingIDnorTable' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userRemovesAccountUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserRemovesAccountUseCase().execute(IdentificationMother.invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userRemovesAccountUseCase.run()
