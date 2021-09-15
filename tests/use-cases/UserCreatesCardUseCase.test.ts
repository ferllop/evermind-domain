import { ImplementationsContainer } from '../../src/implementations/ImplementationsContainer.js'
import { InMemoryDatastore } from '../../src/implementations/InMemoryDatastore.js'
import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { Response } from '../../src/use-cases/Response.js'
import { UserCreatesCardUseCase } from '../../src/use-cases/UserCreatesCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { DatastoreMother } from '../models/DatastoreMother.js'
import { DatastoreTestClass } from '../models/DatastoreTestClass.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { assert, suite } from '../test-config.js'

const userCreatesCardUseCase = suite("User creates a card use case")

const cardMother = new CardMother()

userCreatesCardUseCase.before.each(() => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
})

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', () => {
        const result = executeUseCase()
        assert.equal(result, Response.OkWithoutData())
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', () => {
    ImplementationsContainer.set('datastore', new DatastoreTestClass())
    const datastore = ImplementationsContainer.get('datastore') as DatastoreTestClass
        executeUseCase()
        assert.ok(new DatastoreMother(cardMother, datastore).isDataStored(datastore.dtoId, 'authorId'))
    })

userCreatesCardUseCase(
    'given wrong card data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', () => {
        const invalidData = {...cardMother.invalidDto(), userId: ''}
        const result = new UserCreatesCardUseCase().execute(invalidData)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

function executeUseCase() {
    return new UserCreatesCardUseCase().execute({
        ...cardMother.dto(), 
        userId: IdentificationMother.dto().id
    })
}

userCreatesCardUseCase.run()

