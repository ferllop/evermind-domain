import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { Response } from '../../src/use-cases/Response.js'
import { CardMother } from '../models/card/CardMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { assert, suite } from '../test-config.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import { AsyncInMemoryDatastore } from '../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'
import { AsyncUserReadsACardUseCase } from '../../src/use-cases/AsyncUserReadsACardUseCase.js'
import { AsyncDatastoreMother } from '../models/AsyncDatastoreMother.js'
import { AsyncDatastore } from '../../src/models/AsyncDatastore.js'

const userReadsACardUseCase = suite("User reads a card use case")

const cardMother = new CardMother()

let datastore: AsyncDatastore

userReadsACardUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.ASYNC_DATASTORE, new AsyncInMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.ASYNC_DATASTORE) as AsyncDatastore
})

userReadsACardUseCase(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new AsyncUserReadsACardUseCase().execute(IdentificationMother.invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userReadsACardUseCase(
    'given a non existing id in an existing cards table, ' +
    'should return an object with data property as null ' +
    'and CARD_NOT_FOUND DomainError', async () => {
        await new AsyncDatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new AsyncUserReadsACardUseCase().execute({ id: 'nonExistingId' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userReadsACardUseCase(
    'given a non existing cards table, ' +
    'should return an object with data property as null ' +
    'and CARD_NOT_FOUND DomainError', async () => {
        const result = await new AsyncUserReadsACardUseCase().execute({ id: 'nonExistingId' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userReadsACardUseCase(
    'given an existing id, ' +
    'should return an object with null as error and card as data', async () => {
        await new AsyncDatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new AsyncUserReadsACardUseCase().execute(IdentificationMother.numberedDto(1))
        assert.equal(result, Response.OkWithData(cardMother.numberedDto(1)))
    })

userReadsACardUseCase.run()
