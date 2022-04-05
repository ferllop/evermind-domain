import {Action} from '../../../../src/delivery/rest-api/actions/Action.js'
import {Router} from '../../../../src/delivery/rest-api/routers/Router.js'

export class FakeRouter extends Router {
    constructor(...actions: Action[]) {
        super('/test', ...actions)
    }
}