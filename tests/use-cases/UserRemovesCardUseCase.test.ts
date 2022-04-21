import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserRemovesCardUseCase} from '../../src/use-cases/UserRemovesCardUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredCardFromUser,
    givenAStoredUserWithPermissions,
    withAnyRequester,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {
    assertCardIsNotStored,
    assertCardIsStored,
} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {CardNotFoundError} from '../../src/domain/errors/CardNotFoundError.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'
import {CardBuilder} from '../domain/card/CardBuilder.js'

const userRemovesCardUseCase = suite('User removes card use case')

userRemovesCardUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userRemovesCardUseCase(
    'given an existing card id, and a user with permission to delete own cards' +
    'should remove the card and return an object with either ' +
    'data and error properties as null', async () => {
        const user = await givenAStoredUserWithPermissions(['DELETE_OWN_CARD'])
        const card = await givenAStoredCardFromUser(user)
        await assertCardIsStored(card, 'Before delete use case')
        const result = await new UserRemovesCardUseCase().execute(({id: card.id, requesterId: user.getId().getId()}))
        await assertCardIsNotStored(card, 'After delete use case')
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesCardUseCase(
    'given an unexisting card id into an existing cards table, ' +
    'it should return an object with data property as null and ' +
    'error property as CARD_NOT_FOUND DomainError', async () => {
        const requester = await givenAStoredUserWithPermissions(['DELETE_OWN_CARD'])
        const unexistingCard = new CardBuilder().withAuthorId(requester.getId().getId()).build().toDto()
        const result = await new UserRemovesCardUseCase().execute({
            requesterId: requester.getId().getId(),
            id: unexistingCard.id,
        })
        assert.equal(result, Response.withDomainError(new CardNotFoundError()))
    })

userRemovesCardUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidRequest = {
            id: '',
        }
        const result = await new UserRemovesCardUseCase().execute(withAnyRequester(invalidRequest))
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userRemovesCardUseCase('given an existing card id, ' +
    'should return an object with error UserIsNotAuthorized and null data', async () => {
    const card = await givenAStoredCard()
    await assertCardIsStored(card, 'Before delete')
    const result = await new UserRemovesCardUseCase().execute({id: card.id, requesterId: card.authorId})
    await assertCardIsStored(card, 'After delete')
    assert.equal(
        result,
        Response.withDomainError(
            new UserIsNotAuthorizedError(['DELETE_OWN_CARD'])))
})

userRemovesCardUseCase('given an existing card id, and a user with permission to delete cards from other users' +
    'should return an object with error UserIsNotAuthorized and null data', async () => {
    const notAuthorUser = await givenAStoredUserWithPermissions(['DELETE_CARD_FROM_OTHER'])
    const card = await givenAStoredCard()
    await assertCardIsStored(card, 'Before delete use case')
    await new UserRemovesCardUseCase().execute({id: card.id, requesterId: notAuthorUser.getId().getId()})
    await assertCardIsNotStored(card, 'After delete use case')
})

userRemovesCardUseCase('given an existing card id, and a user without permission to delete cards from other users' +
    'should return an object with error UserIsNotAuthorized DELETE_CARDS_FROM_OTHERS and null data', async () => {
    const notAuthorUser = await givenAStoredUserWithPermissions([])
    const card = await givenAStoredCard()
    await assertCardIsStored(card, 'Before delete use case')
    const result = await new UserRemovesCardUseCase().execute({id: card.id, requesterId: notAuthorUser.getId().getId()})
    await assertCardIsStored(card, 'After delete use case')
    assert.equal(
        result,
        Response.withDomainError(
            new UserIsNotAuthorizedError(['DELETE_CARD_FROM_OTHER'])))
})

userRemovesCardUseCase.run()
