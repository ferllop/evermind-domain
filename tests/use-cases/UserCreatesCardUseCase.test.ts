import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserCreatesCardUseCase} from '../../src/use-cases/UserCreatesCardUseCase.js'
import {CardBuilder} from '../domain/card/CardBuilder.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUserWithPermissions,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {assertUserHasStoredACard} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {CreateOwnCard} from '../../src/domain/authorization/permission/permissions/CreateOwnCard.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'
import {UserIdentification} from '../../src/domain/user/UserIdentification.js'

const userCreatesCardUseCase = suite("User creates a card use case")

userCreatesCardUseCase.before( async () => await givenACleanInMemoryDatabase())

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with no error and card data', async () => {
        const user = await givenAStoredUserWithPermissions([CreateOwnCard])
        const {id, authorId, ...card} = new CardBuilder().buildDto()
        const request = {
            ...card,
            authorId: user.id,
            requesterId: user.id,
        }
        const result = await new UserCreatesCardUseCase().execute(request)
        const expectedCard = {...card, authorId: user.id, id: result.data!.id}
        assert.equal(result,
            Response.OkWithData(expectedCard))
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', async () => {
        const user = await givenAStoredUserWithPermissions([CreateOwnCard])
        const card = new CardBuilder().buildDto()
        const {id, authorId, ...unidentifiedCard} = card

        await new UserCreatesCardUseCase().execute({
            ...unidentifiedCard,
            authorId: user.id,
            requesterId: user.id,
        })

        await assertUserHasStoredACard({
            ...card,
            authorId: user.id
        })
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'with a user without permission to create an own card should return a UserIsNotAuthorized', async () => {
        const user = await givenAStoredUserWithPermissions([])
        const {id, authorId, ...card} = new CardBuilder().buildDto()
        const request = {
            ...card,
            authorId: user.id,
            requesterId: user.id,
        }
        const result = await new UserCreatesCardUseCase().execute(request)
        assert.equal(result,
            Response.withDomainError(new UserIsNotAuthorizedError(['CREATE_OWN_CARD'])))
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when a user execute this use case, ' +
    'without permission to create card to be authored to other user should return a UserIsNotAuthorized', async () => {
        const user = await givenAStoredUserWithPermissions([])
        const {id, authorId, ...card} = new CardBuilder().buildDto()
        const request = {
            ...card,
            authorId: user.id,
            requesterId: UserIdentification.create().getId(),
        }
        const result = await new UserCreatesCardUseCase().execute(request)
        assert.equal(result,
            Response.withDomainError(new UserIsNotAuthorizedError(['CREATE_CARD_FOR_OTHER'])))
    })

userCreatesCardUseCase(
    'given wrong card data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidUserId= ''
        const invalidRequest = {
            ...new CardBuilder().buildDto(),
            authorId: invalidUserId,
            requesterId: 'aValidId'
        }
        const result = await new UserCreatesCardUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userCreatesCardUseCase.run()
