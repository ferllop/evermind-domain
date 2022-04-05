import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {RequiredRequestFieldIsMissingError} from '../../src/domain/errors/RequiredRequestFieldIsMissingError.js'
import {FakeUseCase} from './FakeUseCase.js'

const useCase = suite('Use Case')

useCase('should return REQUEST_FIELD_NOT_VALID when a required field is not present in request', async () => {
    assert.equal(
        await new FakeUseCase()
            .withRequiredFields('fieldA', 'fieldB')
            .execute({fieldA: 'someData'}),
        Response.withDomainError(new RequiredRequestFieldIsMissingError(['fieldB'])))
})

useCase('should return REQUEST_FIELD_NOT_VALID when a required field is present in request with undefined value', async () => {
    // @ts-ignore
    assert.equal(
    // @ts-ignore
        await new FakeUseCase()
            .withRequiredFields('fieldA', 'fieldB')
            .execute({fieldA: 'someData', fieldB: undefined}),
        Response.withDomainError(new RequiredRequestFieldIsMissingError(['fieldB'])))
})

useCase('should permit extra fields in addition to the required ones', async () => {
    assert.equal(
        await new FakeUseCase()
            .withRequiredFields('fieldA', 'fieldB')
            .execute({fieldA: 'someData', fieldB: 'someDataB', extraField: 'someExtraData'}),
        Response.OkWithoutData())
})

useCase('should be capable of insert a not documented error thrown from internalExecute into a response', async () => {
    const useCase = new FakeUseCase()
    const error = new TypeError()
    useCase.withError(error)
    assert.equal(
        await useCase.execute({fieldA: 'someData', fieldB: 'otherData'}),
        Response.withError(error))
})

useCase.run()