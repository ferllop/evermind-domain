import {UserMother} from '../domain/user/UserMother.js'
import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {ImplementationsContainer} from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {UserSignsUpUseCase} from '../../src/use-cases/UserSignsUpUseCase.js'
import {Username} from '../../src/domain/user/Username'
import {UserMapper} from '../../src/domain/user/UserMapper'
import {PersistenceFactory} from '../../src/implementations/persistence/PersistenceFactory'

const userSignsUpUseCase = suite('User signs up use case')

userSignsUpUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
})

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', async () => {
        const result = await new UserSignsUpUseCase().execute(new UserMother().dto())
        assert.equal(result, Response.OkWithoutData())
    })

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'the user should remain in storage', async () => {
        const user = {name: 'Maria', username: 'maria82'}
        await new UserSignsUpUseCase().execute(user)
        const storedUser = await PersistenceFactory.getUserDao().findByUsername(new Username(user.username))

        const mapper = new UserMapper()
        const expectedUser = mapper.fromDto({
            ...mapper.toDto(storedUser),
            ...user,
        })
        assert.equal(storedUser, expectedUser)
    })

userSignsUpUseCase(
    'given wrong user data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new UserSignsUpUseCase().execute(new UserMother().invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userSignsUpUseCase.run()
