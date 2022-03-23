import {CardDto} from '../../src/domain/card/CardDto.js'
import {CardField} from '../../src/implementations/persistence/in-memory/CardField.js'
import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredCardFromUser,
    givenAStoredUser,
    givenAStoredUserWithPermissions,
    withAnyRequester,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {CardBuilder} from '../domain/card/CardBuilder.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {CardNotFoundError} from '../../src/domain/errors/CardNotFoundError.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'
import {UserTransfersCardUseCase} from '../../src/use-cases/UserTransfersCardUseCase.js'
import {UserIdentification} from '../../src/domain/user/UserIdentification.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'

const userTransfersCardUseCase = suite('User transfers card use case')

userTransfersCardUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userTransfersCardUseCase(
    'given an unexisting card, ' +
    'when transferring an unexisting card' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError', async () => {
        const receivingUser = await givenAStoredUser()
        const notStoredCard = new CardBuilder().buildDto()
        const result = await new UserTransfersCardUseCase().execute({
            requesterId: notStoredCard.authorId,
            cardId: notStoredCard.id,
            authorId: receivingUser.id,
        })
        assert.equal(result, Response.withDomainError(new CardNotFoundError()))
    })

userTransfersCardUseCase(
    'given an existing card, ' +
    'when transferring to an unexisting user' +
    'should return an object with null as data property and ' +
    'USER_NOT_FOUND DomainError', async () => {
        const card = await givenAStoredCard()
        const result = await new UserTransfersCardUseCase().execute({
            requesterId: card.authorId,
            cardId: card.id,
            authorId: UserIdentification.create().getId(),
        })
        assert.equal(result, Response.withDomainError(new UserNotFoundError()))
    })

userTransfersCardUseCase(
    'given a previously stored card' +
    'when its author transfers the card to another existing user'+
    'and has permission to do it' +
    'the card should be transferred and null should be returned', async () => {
        const receivingUser = await givenAStoredUser()
        const authorUser = await givenAStoredUserWithPermissions(['TRANSFER_OWN_CARD'])
        const card = await givenAStoredCardFromUser(authorUser)
        const result = await new UserTransfersCardUseCase().execute({
            requesterId: authorUser.id,
            cardId: card.id,
            authorId: receivingUser.id,
        })
        const storedCard = await new InMemoryDatastore().read<CardDto>('cards', card.id)
        assert.equal(result, Response.OkWithoutData())
        assert.equal(storedCard!.authorId, receivingUser.id)
    })

userTransfersCardUseCase(
    'given a previously stored card' +
    'when its author transfers the card to another existing user'+
    'and not has permission to do it' +
    'the card should not be transferred and ' +
    'UserIsNotAuthorizedError TRANSFER_OWN_CARD should be returned', async () => {
        const receivingUser = await givenAStoredUser()
        const authorUser = await givenAStoredUserWithPermissions([])
        const card = await givenAStoredCardFromUser(authorUser)
        const result = await new UserTransfersCardUseCase().execute({
            requesterId: authorUser.id,
            cardId: card.id,
            authorId: receivingUser.id,
        })
        const storedCard = await new InMemoryDatastore().read<CardDto>('cards', card.id)
        assert.equal(result, Response.withDomainError(new UserIsNotAuthorizedError(['TRANSFER_OWN_CARD'])))
        assert.equal(storedCard!.authorId, card.authorId)
    })

userTransfersCardUseCase(
    'given a previously stored card' +
    'when a user, that is not the author, transfers the card to another existing user'+
    'and has permission to do it' +
    'the card should be transferred and null should be returned', async () => {
        const requesterUser = await givenAStoredUserWithPermissions(['TRANSFER_CARD_FROM_ANOTHER'])
        const receivingUser = await givenAStoredUser()
        const card = await givenAStoredCard()
        const result = await new UserTransfersCardUseCase().execute({
            requesterId: requesterUser.id,
            cardId: card.id,
            authorId: receivingUser.id,
        })
        const storedCard = await new InMemoryDatastore().read<CardDto>(CardField.TABLE_NAME, card.id)
        assert.equal(result, Response.OkWithoutData())
        assert.equal(storedCard!.authorId, receivingUser.id)
    })

userTransfersCardUseCase(
    'given a previously stored card' +
    'when a user, that is not the author, transfers the card to another existing user'+
    'and not has permission to do it' +
    'the card should remain unchanged and ' +
    'UserIsNotAuthorizedError TRANSFER_CARD_FROM_ANOTHER should be returned', async () => {
        const requesterUser = await givenAStoredUserWithPermissions([])
        const receivingUser = await givenAStoredUser()
        const card = await givenAStoredCard()
        const result = await new UserTransfersCardUseCase().execute({
            requesterId: requesterUser.id,
            cardId: card.id,
            authorId: receivingUser.id,
        })
        const storedCard = await new InMemoryDatastore().read<CardDto>(CardField.TABLE_NAME, card.id)
        assert.equal(result, Response.withDomainError(new UserIsNotAuthorizedError(['TRANSFER_CARD_FROM_ANOTHER'])))
        assert.equal(storedCard!.authorId, card.authorId)
    })

// userTransfersCardUseCase(
//     'given a previously stored card and data to update it, ' +
//     'should return an object with null as error property and ' +
//     'null as data property', async () => {
//         const user = await givenAStoredUserWithPermissions(['UPDATE_OWN_CARD'])
//         const card = await givenAStoredCardFromUser(user)
//         const result = await new UserModifiesCardDataUseCase().execute(
//             {
//                 ...card,
//                 question: 'updatedQuestion',
//                 requesterId: card.authorId,
//             })
//         assert.equal(result, Response.OkWithoutData())
//     })
//
// userTransfersCardUseCase(
//     'given an unexisting card in an existing table, ' +
//     'should return an object with null as data property and ' +
//     'CARD_NOT_FOUND DomainError as error', async () => {
//         const card = await givenAStoredCard()
//         const result = await new UserModifiesCardDataUseCase().execute(withAnyRequester({
//             ...card,
//             id: 'notExistingId',
//         }))
//         assert.equal(result, Response.withDomainError(new CardNotFoundError()))
//     })
//
userTransfersCardUseCase(
    'given wrong cardId, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const card = await givenAStoredCard()
        const invalidCardIdRequest = withAnyRequester({
            cardId: '',
            authorId: card.authorId,
        })
        const result = await new UserTransfersCardUseCase().execute(invalidCardIdRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userTransfersCardUseCase(
    'given wrong authorId, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const card = await givenAStoredCard()
        const invalidCardIdRequest = withAnyRequester({
            cardId: card.id,
            authorId: '',
        })
        const result = await new UserTransfersCardUseCase().execute(invalidCardIdRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userTransfersCardUseCase(
    'given wrong requesterId, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const card = await givenAStoredCard()
        const invalidCardIdRequest = {
            requesterId: '',
            cardId: card.id,
            authorId: card.authorId,
        }
        const result = await new UserTransfersCardUseCase().execute(invalidCardIdRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userTransfersCardUseCase.run()
