import {UserDto} from '../../src/domain/user/UserDto.js'
import {UserMother} from '../domain/user/UserMother.js'
import {IdentificationMother} from '../domain/value/IdentificationMother.js'
import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {ImplementationsContainer} from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import {DatastoreMother} from '../domain/shared/DatastoreMother.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {UserRemovesAccountUseCase} from '../../src/use-cases/UserRemovesAccountUseCase.js'

const userRemovesAccountUseCase = suite("User removes account use case")

let datastore: InMemoryDatastore
let datastoreMother: DatastoreMother<UserDto>

userRemovesAccountUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.DATASTORE) as InMemoryDatastore
    datastoreMother = new DatastoreMother(new UserMother(), datastore)
})

userRemovesAccountUseCase(
    'given an existing user id, ' +
    'should return an object with either ' +
    'data and error properties as null', async () => {
        await datastoreMother.having(1).storedIn()
        const result = await new UserRemovesAccountUseCase().execute(IdentificationMother.numberedDto(1))
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesAccountUseCase('given an existing user id, should remove it', async () => {
    await datastoreMother.having(1).storedIn()
    assert.is(await datastoreMother.exists(1), true)
    await new UserRemovesAccountUseCase().execute(IdentificationMother.numberedDto(1))
    assert.is(await datastoreMother.exists(1), false)
})

userRemovesAccountUseCase(
    'given an non-existing user id into an existing users table, ' +
    'it should return an object with data property as null and ' +
    'error property as USER_NOT_FOUND DomainError', async () => {
        await datastoreMother.having(1).storedIn()
        const result = await new UserRemovesAccountUseCase().execute({ id: 'non-existingId' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userRemovesAccountUseCase(
    'given an non-existing table, ' +
    'it should return an object with data property as null and ' +
    'error property as USER_NOT_FOUND DomainError', async () => {
        const result = await new UserRemovesAccountUseCase().execute({ id: 'non-existingIdNorTable' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userRemovesAccountUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new UserRemovesAccountUseCase().execute(IdentificationMother.invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userRemovesAccountUseCase.run()
