import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserModifiesUserDataUseCase} from '../../src/use-cases/UserModifiesUserDataUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {assertUserIsStored} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {UserBuilder} from '../domain/user/UserBuilder.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'
import {RequiredRequestFieldIsMissingError} from '../../src/domain/errors/RequiredRequestFieldIsMissingError.js'

const userModifiesUserDataUseCase = suite("User modifies user data use case")

userModifiesUserDataUseCase.before.each(async () => await givenACleanInMemoryDatabase())

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
        assert.equal(result, Response.withDomainError(new UserNotFoundError()))
    })

userModifiesUserDataUseCase(
    'given wrong user data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidUserId = ''
        const invalidRequest = {
            ...new UserBuilder().buildDto(),
            id: invalidUserId
        }
        const result = await new UserModifiesUserDataUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userModifiesUserDataUseCase(
    'given wrong user data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const {name, ...incompleteRequest} = new UserBuilder().buildDto()
        // @ts-ignore
        const result = await new UserModifiesUserDataUseCase().execute(incompleteRequest)
        assert.equal(result, Response.withDomainError(new RequiredRequestFieldIsMissingError(['name'])))
    })

userModifiesUserDataUseCase.run()
