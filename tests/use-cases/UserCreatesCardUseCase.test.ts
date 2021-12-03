import {ImplementationsContainer} from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {CardMother} from '../domain/card/CardMother.js'
import {IdentificationMother} from '../domain/value/IdentificationMother.js'
import {assert, suite} from '../test-config.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {DatastoreTestClass} from '../domain/DatastoreTestClass.js'
import {DatastoreMother} from '../domain/DatastoreMother.js'
import {UserCreatesCardUseCase} from '../../src/use-cases/UserCreatesCardUseCase.js'

const userCreatesCardUseCase = suite("User creates a card use case")

const cardMother = new CardMother()

userCreatesCardUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
})

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', async () => {
        const result = await executeUseCase()
        assert.equal(result, Response.OkWithoutData())
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', async () => {
        ImplementationsContainer.set(Dependency.DATASTORE, new DatastoreTestClass())
        const datastore = ImplementationsContainer.get(Dependency.DATASTORE) as DatastoreTestClass
        await executeUseCase()
        assert.is(await (new DatastoreMother(cardMother, datastore)).isDataStored(datastore.dtoId, 'authorId'), true)
    })

userCreatesCardUseCase(
    'given wrong card data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidData = {...cardMother.invalidDto(), userId: ''}
        const result = await new UserCreatesCardUseCase().execute(invalidData)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

async function executeUseCase() {
    return new UserCreatesCardUseCase().execute({
        ...cardMother.dto(),
        userId: IdentificationMother.dto().id
    })
}

userCreatesCardUseCase.run()

