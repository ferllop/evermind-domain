import {UserDto} from '../../src/models/user/UserDto.js'
import {UserMother} from '../models/user/UserMother.js'
import {IdentificationMother} from '../models/value/IdentificationMother.js'
import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {ErrorType} from '../../src/models/errors/ErrorType.js'
import {ImplementationsContainer} from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import {AsyncDatastore} from '../../src/models/AsyncDatastore.js'
import {AsyncDatastoreMother} from '../models/AsyncDatastoreMother.js'
import {AsyncInMemoryDatastore} from '../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'
import {AsyncUserRemovesAccountUseCase} from '../../src/use-cases/AsyncUserRemovesAccountUseCase.js'

const userRemovesAccountUseCase = suite("User removes account use case")

let datastore: AsyncDatastore
let datastoreMother: AsyncDatastoreMother<UserDto>

userRemovesAccountUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.ASYNC_DATASTORE, new AsyncInMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.ASYNC_DATASTORE) as AsyncDatastore
    datastoreMother = new AsyncDatastoreMother(new UserMother(), datastore)
})

userRemovesAccountUseCase(
    'given an existing user id, ' +
    'should return an object with either ' +
    'data and error properties as null', async () => {
        await datastoreMother.having(1).storedIn()
        const result = await new AsyncUserRemovesAccountUseCase().execute(IdentificationMother.numberedDto(1))
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesAccountUseCase('given an existing user id, should remove it', async () => {
    await datastoreMother.having(1).storedIn()
    assert.is(await datastoreMother.exists(1), true)
    await new AsyncUserRemovesAccountUseCase().execute(IdentificationMother.numberedDto(1))
    assert.is(await datastoreMother.exists(1), false)
})

userRemovesAccountUseCase.only(
    'given an non-existing user id into an existing users table, ' +
    'it should return an object with data property as null and ' +
    'error property as USER_NOT_FOUND DomainError', async () => {
        await datastoreMother.having(1).storedIn()
        const result = await new AsyncUserRemovesAccountUseCase().execute({ id: 'non-existingId' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userRemovesAccountUseCase(
    'given an non-existing table, ' +
    'it should return an object with data property as null and ' +
    'error property as USER_NOT_FOUND DomainError', async () => {
        const result = await new AsyncUserRemovesAccountUseCase().execute({ id: 'non-existingIdNorTable' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userRemovesAccountUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new AsyncUserRemovesAccountUseCase().execute(IdentificationMother.invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userRemovesAccountUseCase.run()
