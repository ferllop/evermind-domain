import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserCreatesCardUseCase} from '../../src/use-cases/UserCreatesCardUseCase.js'
import {CardBuilder} from '../domain/card/CardBuilder.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {assertUserHasStoredACard} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'

const userCreatesCardUseCase = suite("User creates a card use case")

userCreatesCardUseCase.before( async () => await givenACleanInMemoryDatabase())

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with no error and card data', async () => {
        const {id: userId} = await givenAStoredUser()
        const {id, authorId, ...card} = new CardBuilder().buildDto()
        const request = {
            ...card,
            userId,
        }
        const result = await new UserCreatesCardUseCase().execute(request)
        const expectedCard = {...card, authorId: userId, id: result.data!.id}
        assert.equal(result,
            Response.OkWithData(expectedCard))
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', async () => {
        const {id: userId} = await givenAStoredUser()
        const card = new CardBuilder().buildDto()
        const {id, authorId, ...unidentifiedCard} = card

        await new UserCreatesCardUseCase().execute({
            ...unidentifiedCard,
            userId
        })

        await assertUserHasStoredACard({
            ...card,
            authorId: userId
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
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userCreatesCardUseCase.run()

