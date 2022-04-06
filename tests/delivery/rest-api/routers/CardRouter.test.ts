import {suite} from '../../../test-config.js'
import {TestableApp} from '../TestableApp.js'
import {CardDto, UserCreatesCardRequest, UserModifiesCardDataRequest} from '../../../../src/index.js'
import {CardRouter} from '../../../../src/delivery/rest-api/routers/CardRouter.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCardFromUser, givenAStoredUser,
    givenAStoredUserWithPermissions,
} from '../../../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {givenAnExistingCard} from '../../../implementations/persistence/postgres/card/CardScenario.js'
import {RequiredRequestFieldIsMissingError} from '../../../../src/domain/errors/RequiredRequestFieldIsMissingError.js'
import {
    assertCardIsNotStored,
    assertCardIsStored,
} from '../../../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {CardBuilder} from '../../../domain/card/CardBuilder.js'

type Context = {
    app: TestableApp
}

const cardRouter = suite<Context>("Card router")

cardRouter.before.each(async context => {
    await givenACleanInMemoryDatabase()
    context.app = new TestableApp(new CardRouter())
})

cardRouter('given a user with permissions,' +
    'when creating a card ' +
    'should return card and 201 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['CREATE_OWN_CARD'])
    const {id, ...card} = new CardBuilder().withAuthorId(user.id).buildDto()
    const request: UserCreatesCardRequest = {...card, requesterId: user.id}
    const result = await app.post('/cards', request)
    const expectedCard: CardDto = {
        id: result.body.domain.data.id,
        ...card
    }
    app.assert()
        .hasStatusCode(201)
        .domain().hasData(expectedCard)
})

cardRouter('given a request with missing requesterId field ' +
    'when creating a card' +
    'should return an RequiredRequestFieldIsMissingError with 400 http response', async ({app}) => {
    const card = await givenAnExistingCard()
    await app.post('/cards', {...card})
    app.assert()
        .hasStatusCode(400)
        .domain()
        .hasError(new RequiredRequestFieldIsMissingError(['requesterId']))
})

cardRouter('when getting by its id should return card and 200 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions([])
    const card = await givenAStoredCardFromUser(user)
    await app.get('/cards/' + card.id)
    app.assert()
        .hasStatusCode(200)
        .domain()
        .hasData(card)
})

cardRouter('when modifying a card should modify the card return empty and 204 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['UPDATE_OWN_CARD'])
    const card = await givenAStoredCardFromUser(user)
    const modifiedCard: CardDto = {...card, question: 'different question'}
    const request: UserModifiesCardDataRequest = {
        requesterId: user.id,
        ...modifiedCard,
    }
    await app.put('/cards/' + card.id, request)
    app.assert()
        .hasStatusCode(204)
        .hasEmptyData()
    assertCardIsStored(modifiedCard)
})

cardRouter('when deleting a card should delete the card return empty and 204 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['DELETE_OWN_CARD'])
    const card = await givenAStoredCardFromUser(user)
    await app.delete('/cards/' + card.id, {requesterId: user.id})
    app.assert()
        .hasStatusCode(204)
        .hasEmptyData()
    assertCardIsNotStored(card)
})

cardRouter('given a user with permissions, ' +
    'when transferring a card, ' +
    'then the card is transferred and get 201 stuts code', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['TRANSFER_OWN_CARD'])
    const card = await givenAStoredCardFromUser(user)
    const receivingUser = await givenAStoredUser()
    await app.post(`/cards/${card.id}/transfer/${receivingUser.id}`, {requesterId: user.id})
    app.assert()
        .hasStatusCode(204)
        .hasEmptyData()
    await assertCardIsStored({...card, authorId: receivingUser.id})
})

cardRouter.run()
