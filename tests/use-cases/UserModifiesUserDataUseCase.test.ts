import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserModifiesUserDataUseCase} from '../../src/use-cases/UserModifiesUserDataUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUserWithPermissions,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {assertUserIsStored} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {UserBuilder} from '../domain/user/UserBuilder.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'

const userModifiesUserDataUseCase = suite('User modifies user data use case')

userModifiesUserDataUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userModifiesUserDataUseCase(
    'given a previously stored user and data to update it, ' +
    'the user should be updated in storage and ' +
    'return an object with null as error property and ' +
    'null as data property', async () => {
        const user = await givenAStoredUserWithPermissions(['UPDATE_OWN_PRIVATE_DATA'])
        const updatedUser = {
            ...user.toDto(),
            name: 'newName',
        }
        const request = {
            requesterId: user.getId().getId(),
            ...updatedUser,
        }
        const result = await new UserModifiesUserDataUseCase().execute(request)
        assert.equal(result, Response.OkWithoutData())
        await assertUserIsStored(updatedUser)
    })

userModifiesUserDataUseCase(
    'given an unexisting user in an existing table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', async () => {
        const user = await givenAStoredUserWithPermissions(['UPDATE_PRIVATE_DATA_FROM_OTHERS'])
        const notStoredUser = new UserBuilder().buildDto()
        const request = {
            requesterId: user.getId().getId(),
            ...notStoredUser,
        }
        const result = await new UserModifiesUserDataUseCase().execute(request)
        assert.equal(result, Response.withDomainError(new UserNotFoundError()))
    })

userModifiesUserDataUseCase(
    'given wrong user data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const requester = await givenAStoredUserWithPermissions(['UPDATE_OWN_PRIVATE_DATA'])
        const invalidUser = {
            ...requester.toDto(),
            name: '',
        }
        const invalidRequest = {
            requesterId: requester.getId().getId(),
            ...invalidUser,
        }
        const result = await new UserModifiesUserDataUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userModifiesUserDataUseCase.run()
