import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { Response } from '../../src/use-cases/Response.js'
import { CardMother } from '../models/card/CardMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { assert, suite } from '../test-config.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { AsyncDatastore } from '../../src/models/AsyncDatastore.js'
import { AsyncDatastoreMother } from '../models/AsyncDatastoreMother.js'
import { AsyncUserRemovesCardUseCase } from '../../src/use-cases/AsyncUserRemovesCardUseCase.js'

const userRemovesCardUseCase = suite("User removes card use case")

const cardMother = new CardMother()

let datastore: AsyncDatastore
userRemovesCardUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.ASYNC_DATASTORE, new InMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.ASYNC_DATASTORE) as AsyncDatastore
})

userRemovesCardUseCase(
    'given an existing card id, ' +
    'should return an object with either ' +
    'data and error properties as null', async () => {
        await new AsyncDatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new AsyncUserRemovesCardUseCase().execute(IdentificationMother.numberedDto(1))
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesCardUseCase('given an existing card id, should remove it', async () => {
    const dsMother = await new AsyncDatastoreMother(cardMother, datastore).having(1).storedIn()
    assert.ok(await dsMother.exists(1))
    await new AsyncUserRemovesCardUseCase().execute(IdentificationMother.numberedDto(1))
    assert.not.ok(await dsMother.exists(1))
})

userRemovesCardUseCase(
    'given an unexisting card id into an existing cards table, ' +
    'it should return an object with data property as null and ' +
    'error property as CARD_NOT_FOUND DomainError', async () => {
        await new AsyncDatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new AsyncUserRemovesCardUseCase().execute({ id: 'unexistingID' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userRemovesCardUseCase(
    'given an unexisting table, ' +
    'it should return an object with data property as null and ' +
    'error property as CARD_NOT_FOUND DomainError', async () => {
        const result = await new AsyncUserRemovesCardUseCase().execute({ id: 'unexistingIDnorTable' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userRemovesCardUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new AsyncUserRemovesCardUseCase().execute(IdentificationMother.invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userRemovesCardUseCase.run()
