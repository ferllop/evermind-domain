import { ErrorType } from '../../src/domain/errors/ErrorType.js'
import { Response } from '../../src/use-cases/Response.js'
import { CardMother } from '../domain/card/CardMother.js'
import { IdentificationMother } from '../domain/value/IdentificationMother.js'
import { assert, suite } from '../test-config.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import { Dependency } from '../../src/implementations/implementations-container/Dependency.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { UserReadsACardUseCase } from '../../src/use-cases/UserReadsACardUseCase.js'
import { DatastoreMother } from '../domain/DatastoreMother.js'
import { Datastore } from '../../src/domain/Datastore.js'

const userReadsACardUseCase = suite("User reads a card use case")

const cardMother = new CardMother()

let datastore: Datastore

userReadsACardUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
})

userReadsACardUseCase(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new UserReadsACardUseCase().execute(IdentificationMother.invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userReadsACardUseCase(
    'given a non existing id in an existing cards table, ' +
    'should return an object with data property as null ' +
    'and CARD_NOT_FOUND DomainError', async () => {
        await new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new UserReadsACardUseCase().execute({ id: 'nonExistingId' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userReadsACardUseCase(
    'given a non existing cards table, ' +
    'should return an object with data property as null ' +
    'and CARD_NOT_FOUND DomainError', async () => {
        const result = await new UserReadsACardUseCase().execute({ id: 'nonExistingId' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userReadsACardUseCase(
    'given an existing id, ' +
    'should return an object with null as error and card as data', async () => {
        await new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new UserReadsACardUseCase().execute(IdentificationMother.numberedDto(1))
        assert.equal(result, Response.OkWithData(cardMother.numberedDto(1)))
    })

userReadsACardUseCase.run()
