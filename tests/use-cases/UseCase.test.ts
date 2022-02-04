import {assert, suite} from '../test-config.js'
import {UseCase} from '../../src/use-cases/UseCase.js'
import {Request} from '../../src/use-cases/Request.js'
import {Response} from '../../src/use-cases/Response.js'
import {RequiredRequestFieldIsMissingError} from '../../src/domain/errors/RequiredRequestFieldIsMissingError.js'

class TestableUseCase extends UseCase<Request, null> {
    error?: Error

    getRequiredRequestFields(): string[] {
        return ['fieldA', 'fieldB']
    }

    async internalExecute(): Promise<Response<null>> {
        if (this.error !== undefined) {
            throw this.error
        }
        return Response.OkWithoutData()
    }

    throwError(error: Error) {
        this.error = error
    }
    
}

const useCase = suite('Use Case')

useCase('should return REQUEST_FIELD_NOT_VALID when a required field is not present in request', async () => {
    assert.equal(
        await new TestableUseCase().execute({fieldA: 'someData'}),
        Response.withDomainError(new RequiredRequestFieldIsMissingError()))
})

useCase('should permit extra fields in addition to the required ones', async () => {
    assert.equal(
        await new TestableUseCase().execute({fieldA: 'someData', fieldB: 'someDataB', extraField: 'someExtraData'}),
        Response.OkWithoutData())
})

useCase('should be capable of insert a not documented error thrown from internalExecute into a response', async () => {
    const useCase = new TestableUseCase()
    useCase.throwError(new TypeError())
    assert.equal(
        await useCase.execute({fieldA: 'someData', fieldB: 'otherData'}),
        Response.withError(new TypeError()))
})

useCase.run()