import {TestableApp} from './TestableApp.js'
import {Route} from '../../../src/delivery/rest-api/routes/Route.js'
import {RouteResult} from '../../../src/delivery/rest-api/routes/RouteResult.js'
import {Router} from '../../../src/delivery/rest-api/routers/Router.js'
import {assert, suite} from '../../test-config.js'

type Context = {
    app: TestableApp,
}

const app = suite<Context>("App")

class FoundAction extends Route {
    constructor(){
        super('get', '/existing')
    }

    extractInputDataFromRequest(): {  } {
        return {}
    }

    override execute(): Promise<RouteResult> {
        return Promise.resolve({statusCode: 200, data: {message: 'Found'}})
    }
}

class FoundActionRouter extends Router {
    constructor() {
        super(
            '/',
            new FoundAction()
        )
    }
}

app.before.each(context => {
    context.app = new TestableApp(new FoundActionRouter())
})

app('should return 404 when asking for an not existing endpoint', async ({app}) => {
    const result = await app.post('/not-existing')
    assert.equal(result.body, {})
    assert.equal(result.status, 404)
})

app('should return what the endpoint returns when it exists', async ({app}) => {
    const result = await app.get('/existing')
    assert.equal(result.body, {message: 'Found'})
    assert.equal(result.status, 200)
})

app.run()