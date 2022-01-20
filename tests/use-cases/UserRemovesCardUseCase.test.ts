import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {IdentificationMother} from '../domain/value/IdentificationMother.js'
import {assert, suite} from '../test-config.js'
import {UserRemovesCardUseCase} from '../../src/use-cases/UserRemovesCardUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios'
import {
    assertCardIsNotStored,
    assertCardIsStored,
} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions'

const userRemovesCardUseCase = suite("User removes card use case")

userRemovesCardUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userRemovesCardUseCase(
    'given an existing card id, ' +
    'should return an object with either ' +
    'data and error properties as null', async () => {
        const {id} = await givenAStoredCard()
        const result = await new UserRemovesCardUseCase().execute({id})
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesCardUseCase('given an existing card id, should remove it', async () => {
    const card = await givenAStoredCard()
    await assertCardIsStored(card)
    await new UserRemovesCardUseCase().execute(IdentificationMother.numberedDto(1))
    await assertCardIsNotStored(card)
})

userRemovesCardUseCase(
    'given an unexisting card id into an existing cards table, ' +
    'it should return an object with data property as null and ' +
    'error property as CARD_NOT_FOUND DomainError', async () => {
        const result = await new UserRemovesCardUseCase().execute({ id: 'unexistingID' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userRemovesCardUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new UserRemovesCardUseCase().execute(IdentificationMother.invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userRemovesCardUseCase.run()
