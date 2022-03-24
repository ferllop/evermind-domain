import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {RequiredRequestFieldIsMissingError} from '../../src/domain/errors/RequiredRequestFieldIsMissingError.js'
import {WithAuthorizationUseCase, WithRequesterRequest} from '../../src/index.js'

class TestableUseCase extends WithAuthorizationUseCase<WithRequesterRequest, null> {
    constructor() {
        super(['fieldA'])
    }

    async internalExecute(): Promise<Response<null>> {
        return Response.OkWithoutData()
    }
}

const useCase = suite('With authorization use Case')

useCase('should return whatever the use case return' +
    'when the required fields are present in request', async () => {
    const validRequest = {fieldA: 'someData', requesterId: 'someId'}
    assert.equal(
        await new TestableUseCase().execute(validRequest),
        Response.OkWithoutData())
})

useCase('should return REQUEST_FIELD_NOT_VALID ' +
    'when a required field is not present in request', async () => {
    const missingFieldRequest = {requesterId: 'someId'}
    assert.equal(
        await new TestableUseCase().execute(missingFieldRequest),
        Response.withDomainError(new RequiredRequestFieldIsMissingError(['fieldA'])))
})

useCase('should return REQUEST_FIELD_NOT_VALID ' +
    'when the requesterId field is not present in request', async () => {
    const missingRequesterRequest = {fieldA: 'someData'}
    assert.equal(
    // @ts-ignore
        await new TestableUseCase().execute(missingRequesterRequest),
        Response.withDomainError(new RequiredRequestFieldIsMissingError(['requesterId'])))
})

useCase.run()