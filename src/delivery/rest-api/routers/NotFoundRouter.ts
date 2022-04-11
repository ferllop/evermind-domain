import {Router} from './Router.js'
import {Route} from '../routes/Route.js'
import {RouteResult} from '../routes/RouteResult.js'

export class NotFoundRouter extends Router {
    constructor() {
        super(
            '*',
            new NotFoundAction())
    }

}
class NotFoundAction extends Route {
    constructor(){
        super('all', '/')
    }

    override execute(): Promise<RouteResult> {
        return Promise.resolve({statusCode: 404, data: {}})
    }
}
