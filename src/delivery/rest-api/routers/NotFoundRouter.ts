import {Router} from './Router.js'
import {Action} from '../actions/Action.js'
import {ActionResult} from '../actions/ActionResult.js'

export class NotFoundRouter extends Router {
    constructor() {
        super(
            '*',
            new NotFoundAction())
    }

}
class NotFoundAction extends Action {
    protected override readonly PATH = '/'
    protected override readonly HTTP_METHOD = 'all'

    constructor(){
        super()
    }

    override execute(): Promise<ActionResult> {
        return Promise.resolve({statusCode: 404, data: {}})
    }
}
