import {suite} from '../../../test-config.js'
import {TestableApp} from '../TestableApp.js'
import {FakeRouter} from './FakeRouter.js'
import {DomainRouteStub} from '../routes/DomainRouteStub.js'
import {UndocumentedError} from '../../../../src/domain/errors/UndocumentedError.js'
import {FakeUseCase} from '../../../use-cases/FakeUseCase.js'

type Context = {
    app: TestableApp
}

const router = suite<Context>('Router')

router.before.each(context => {
    context.app = new TestableApp()
})

router('should obtain data from app', async ({app}) => {
    const name = 'carla'
    const usecase = new FakeUseCase().withResponseData({name})
    app.setRouters(new FakeRouter(new DomainRouteStub(usecase)))
    await app.get('/test/' + name)
    app.assert().domain().hasData( {name})
})

router('should return the error from within the usecase', async ({app}) => {
    const error = new Error('the-error')
    const usecase = new FakeUseCase().withError(error)
    const router = new FakeRouter(new DomainRouteStub(usecase))
    app.setRouters(router)
    await app.get('/test/carla')
    app.assert().domain().hasError(new UndocumentedError(error))
})

router.run()