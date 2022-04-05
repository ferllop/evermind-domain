import {Application, Request, Response, Router as ExpressRouter} from 'express'
import {Action} from '../actions/Action.js'

export abstract class Router {
    protected readonly router: ExpressRouter = ExpressRouter()

    protected constructor(private URI: string, ...userActions: Action[]) {
        userActions.forEach(action => {
            this.registerAction(action)
        })
    }

    registerIn(app: Application) {
        app.use(this.URI, this.router)
    }

    post(path: string, action: Action) {
        this.router.post(path, this.executeAction(action))
    }

    put(path: string, action: Action) {
        this.router.put(path, this.executeAction(action))
    }

    get(path: string, action: Action) {
        this.router.get(path, this.executeAction(action))
    }

    delete(path: string, action: Action) {
        this.router.delete(path, this.executeAction(action))
    }

    all(path: string, action: Action) {
        this.router.all(path, this.executeAction(action))
    }

    private executeAction = (action: Action) =>
        async (req: Request, res: Response) => {
            const result = await action.execute(req)
            res.status(result.statusCode).json(result.data)
        }

    private registerAction(action: Action) {
        action.register(this)
    }
}