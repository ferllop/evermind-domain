import {assert, suite} from '../../../test-config.js'
import {TestableApp} from '../TestableApp.js'
import {FakeRouter} from './FakeRouter.js'
import {FakeDomainAction} from '../actions/FakeDomainAction.js'
import {DomainError} from '../../../../src/domain/errors/DomainError.js'
import {UndocumentedError} from '../../../../src/domain/errors/UndocumentedError.js'
import {FakeUseCase} from '../../../use-cases/FakeUseCase.js'

const router = suite('Router')


export function assertBodyHasDomainData(body: object, data: any) {
    const result = {
        domain: {
            error: {
                code: 0,
                message: 'No error',
            },
            data,
        },
    }
    assert.equal(body, result)
}

export function assertBodyHasDomainError(body: object, error: DomainError) {
    const result = {
        domain: {
            error: {
                code: error.getCode(),
                message: error.message,
            },
            data: null,
        }
    }
    assert.equal(body, result)
}

export function assertBodyIsEmpty(body:object) {
    assert.equal(body, {})
}

router('should obtain data from app', async () => {
    const name = 'carla'
    const usecase = new FakeUseCase().withResponseData({name})
    const app = new TestableApp(new FakeRouter(new FakeDomainAction(usecase)))
    const result = await app.get('/test/' + name)
    assertBodyHasDomainData(result.body, {name})
})

router('should return the error from within the usecase', async () => {
    const usecase = new FakeUseCase()
    const expectedResult = {
        domain: {
            error: {
                code: 1,
                message: 'the-error',
            },
            data: null,
        }
    }
    const error = new Error(expectedResult.domain.error.message)
    usecase.withError(error)
    const router = new FakeRouter(new FakeDomainAction(usecase))
    const app = new TestableApp(router)
    const result = await app.get('/test/carla')
    assertBodyHasDomainError(result.body, new UndocumentedError(error))
})

router.run()