import { UserCreatesCardUseCase } from '../../src/use-cases/UserCreatesCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { assert, suite } from '../test-config.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { Datastore } from '../../src/models/Datastore.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { DatastoreTestClass } from '../storage/datastores/DatastoreTestClass.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { Response } from '../../src/use-cases/Response.js'
import { ErrorType } from '../../src/models/errors/ErrorType.js'

const userCreatesCardUseCase = suite("User creates a card use case")

const cardMother = new CardMother()

let datastore: Datastore
userCreatesCardUseCase.before.each(() => {
    datastore = new InMemoryDatastore()
})

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', () => {
        const result = executeUseCase(datastore)
        assert.equal(result, Response.OkWithoutData())
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', () => {
        const datastore = new DatastoreTestClass()
        executeUseCase(datastore)
        assert.ok(new DatastoreMother(cardMother, datastore).isDataStored(datastore.dtoId, 'authorId'))
    })

userCreatesCardUseCase(
    'given wrong card data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', () => {
        const invalidData = {...cardMother.invalidDto(), userId: ''}
        const result = new UserCreatesCardUseCase().execute(invalidData, datastore)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

function executeUseCase(datastore: Datastore) {
    return new UserCreatesCardUseCase().execute({
        ...cardMother.dto(), 
        userId: IdentificationMother.dto().id
    }, datastore)
}

userCreatesCardUseCase.run()

