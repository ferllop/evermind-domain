import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {UserRemovesAccountUseCase} from '../../src/use-cases/UserRemovesAccountUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios'
import {
    assertUserIsNotStored,
    assertUserIsStored,
} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions'

const userRemovesAccountUseCase = suite('User removes account use case')

userRemovesAccountUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userRemovesAccountUseCase(
    'given an existing user id, ' +
    'should return an object with either ' +
    'data and error properties as null', async () => {
        const {id} = await givenAStoredUser()
        const result = await new UserRemovesAccountUseCase().execute({id})
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesAccountUseCase('given an existing user id, should remove it', async () => {
    const user = await givenAStoredUser()
    await assertUserIsStored(user)
    await new UserRemovesAccountUseCase().execute({id: user.id})
    await assertUserIsNotStored(user)
})

userRemovesAccountUseCase(
    'given an non-existing user id into an existing users table, ' +
    'it should return an object with data property as null and ' +
    'error property as USER_NOT_FOUND DomainError', async () => {
        await givenAStoredUser()
        const result = await new UserRemovesAccountUseCase().execute({id: 'non-existingId'})
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userRemovesAccountUseCase(
    'given an non-existing table, ' +
    'it should return an object with data property as null and ' +
    'error property as USER_NOT_FOUND DomainError', async () => {
        const result = await new UserRemovesAccountUseCase().execute({id: 'non-existingIdNorTable'})
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userRemovesAccountUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidRequest = {
            id: ''
        }
        const result = await new UserRemovesAccountUseCase().execute(invalidRequest)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userRemovesAccountUseCase.run()
