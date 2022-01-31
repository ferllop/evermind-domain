import {Request, Response, UseCase} from '../../src/use-cases/index.js'
import {assert, suite} from '../test-config.js'
import {ErrorType} from '../../src/domain/errors/ErrorType.js'

class TestableUseCase extends UseCase<Request, null> {
    getRequiredRequestFields(): string[] {
        return ['fieldA', 'fieldB']
    }

    async internalExecute(): Promise<Response<null>> {
        return Response.OkWithoutData()
    }
    
}

const useCase = suite('Use Case')

useCase('should return REQUEST_FIELD_NOT_VALID when a required field is not present in request', async () => {
    assert.equal(
        await new TestableUseCase().execute({fieldA: 'someData'}),
        Response.withError(ErrorType.REQUEST_FIELD_NOT_VALID))
})

useCase('should permit extra fields in addition to the required ones', async () => {
    assert.equal(
        await new TestableUseCase().execute({fieldA: 'someData', fieldB: 'someDataB', extraField: 'someExtraData'}),
        Response.OkWithoutData())
})

useCase.run()