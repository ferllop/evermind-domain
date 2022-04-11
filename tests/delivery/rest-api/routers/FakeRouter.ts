import {Route} from '../../../../src/delivery/rest-api/routes/Route.js'
import {Router} from '../../../../src/delivery/rest-api/routers/Router.js'

export class FakeRouter extends Router {
    constructor(...actions: Route[]) {
        super('/test', ...actions)
    }
}