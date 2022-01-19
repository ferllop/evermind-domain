import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {CardMother} from '../domain/card/CardMother.js'
import {IdentificationMother} from '../domain/value/IdentificationMother.js'
import {assert, suite} from '../test-config.js'
import {InMemoryDatastoreMother} from '../implementations/persistence/in-memory/InMemoryDatastoreMother.js'
import {UserRemovesCardUseCase} from '../../src/use-cases/UserRemovesCardUseCase.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

const userRemovesCardUseCase = suite("User removes card use case")

const cardMother = new CardMother()

let datastore: InMemoryDatastore
userRemovesCardUseCase.before.each(() => {
    datastore = new InMemoryDatastore()
})

userRemovesCardUseCase(
    'given an existing card id, ' +
    'should return an object with either ' +
    'data and error properties as null', async () => {
        await new InMemoryDatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new UserRemovesCardUseCase().execute(IdentificationMother.numberedDto(1))
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesCardUseCase('given an existing card id, should remove it', async () => {
    const dsMother = await new InMemoryDatastoreMother(cardMother, datastore).having(1).storedIn()
    assert.ok(await dsMother.exists(1))
    await new UserRemovesCardUseCase().execute(IdentificationMother.numberedDto(1))
    assert.not.ok(await dsMother.exists(1))
})

userRemovesCardUseCase(
    'given an unexisting card id into an existing cards table, ' +
    'it should return an object with data property as null and ' +
    'error property as CARD_NOT_FOUND DomainError', async () => {
        await new InMemoryDatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new UserRemovesCardUseCase().execute({ id: 'unexistingID' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userRemovesCardUseCase(
    'given an unexisting table, ' +
    'it should return an object with data property as null and ' +
    'error property as CARD_NOT_FOUND DomainError', async () => {
        const result = await new UserRemovesCardUseCase().execute({ id: 'neither-existingIDorTable' })
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
