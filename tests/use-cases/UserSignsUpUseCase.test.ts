import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {UserSignsUpUseCase} from '../../src/use-cases/UserSignsUpUseCase.js'
import {Username} from '../../src/domain/user/Username.js'
import {UserFactory} from '../../src/domain/user/UserFactory.js'
import {PersistenceFactory} from '../../src/implementations/persistence/PersistenceFactory.js'
import {givenACleanInMemoryDatabase} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {UserBuilder} from '../domain/user/UserBuilder.js'
import {DomainError} from '../../src/domain/errors/DomainError.js'

const userSignsUpUseCase = suite('User signs up use case')

userSignsUpUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', async () => {
        const user = new UserBuilder().buildDto()
        const result = await new UserSignsUpUseCase().execute(user)
        assert.equal(result, Response.OkWithoutData())
    })

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'the user should remain in storage', async () => {
        const user = {name: 'Maria', username: 'maria82'}
        await new UserSignsUpUseCase().execute(user)
        const storedUser = await PersistenceFactory.getUserDao().findByUsername(new Username(user.username))

        const mapper = new UserFactory()
        const expectedUser = mapper.fromDto({
            ...storedUser.toDto(),
            ...user,
        })
        assert.equal(storedUser, expectedUser)
    })

userSignsUpUseCase(
    'given wrong user data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidUsername = ''
        const invalidRequest = {
            ...new UserBuilder().buildDto(),
            username: invalidUsername
        }
        const result = await new UserSignsUpUseCase().execute(invalidRequest)
        assert.equal(result, Response.withError(new DomainError(ErrorType.INPUT_DATA_NOT_VALID)))
    })

userSignsUpUseCase.run()
