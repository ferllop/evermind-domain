import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserCreatesCardUseCase} from '../../src/use-cases/UserCreatesCardUseCase.js'
import {CardBuilder} from '../domain/card/CardBuilder'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios'
import {assertUserHasStoredACard} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions'

const userCreatesCardUseCase = suite("User creates a card use case")

userCreatesCardUseCase.before( async () => await givenACleanInMemoryDatabase())

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', async () => {
        const {id: userId} = await givenAStoredUser()
        const result = await new UserCreatesCardUseCase().execute({
            ...new CardBuilder().buildDto(),
            userId
        })
        assert.equal(result, Response.OkWithoutData())
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', async () => {
        const {id: userId} = await givenAStoredUser()
        const card = new CardBuilder().buildDto()
        const {id, authorID, ...unidentifiedCard} = card

        await new UserCreatesCardUseCase().execute({
            ...unidentifiedCard,
            userId
        })

        await assertUserHasStoredACard({
            ...card,
            authorID: userId
        })
    })

userCreatesCardUseCase(
    'given wrong card data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidUserId= ''
        const invalidRequest = {
            ...new CardBuilder().buildDto(),
            userId: invalidUserId
        }
        const result = await new UserCreatesCardUseCase().execute(invalidRequest)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userCreatesCardUseCase.run()

