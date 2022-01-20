import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {UserMother} from '../domain/user/UserMother.js'
import {assert, suite} from '../test-config.js'
import {UserModifiesUserDataUseCase} from '../../src/use-cases/UserModifiesUserDataUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios'
import {assertUserIsStored} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions'

const userModifiesUserDataUseCase = suite("User modifies user data use case")

userModifiesUserDataUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userModifiesUserDataUseCase(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', async () => {
        const result = await new UserModifiesUserDataUseCase().execute(new UserMother().dto())
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userModifiesUserDataUseCase(
    'given a previously stored user and data to update it, ' +
    'the user should be updated in storage', async () => {
        const user = await givenAStoredUser()
        const updatedUser = { ...user, name: 'newName' }
        await new UserModifiesUserDataUseCase().execute(updatedUser)
        await assertUserIsStored(updatedUser)
    })

userModifiesUserDataUseCase(
    'given a previously stored user and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', async () => {
        const user = await givenAStoredUser()
        const result = await new UserModifiesUserDataUseCase().execute({ ...user, name: 'newName' })
        assert.equal(result, Response.OkWithoutData())
    })

userModifiesUserDataUseCase(
    'given an unexisting user in an existing table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', async () => {
        const user = await givenAStoredUser()
        const result = await new UserModifiesUserDataUseCase().execute({ ...user, id: 'notExistingId' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userModifiesUserDataUseCase(
    'given wrong user data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new UserModifiesUserDataUseCase().execute(new UserMother().invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userModifiesUserDataUseCase.run()
