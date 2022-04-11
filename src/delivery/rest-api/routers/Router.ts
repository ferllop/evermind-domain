import {Application, Request, Response, Router as ExpressRouter} from 'express'
import {Route} from '../routes/Route.js'

export abstract class Router {
    protected readonly router: ExpressRouter = ExpressRouter()

    protected constructor(private URI: string, ...userActions: Route[]) {
        userActions.forEach(action => {
            this.registerAction(action)
        })
    }

    registerIn(app: Application) {
        app.use(this.URI, this.router)
    }

    post(path: string, action: Route) {
        this.router.post(path, this.executeAction(action))
    }

    put(path: string, action: Route) {
        this.router.put(path, this.executeAction(action))
    }

    get(path: string, action: Route) {
        this.router.get(path, this.executeAction(action))
    }

    delete(path: string, action: Route) {
        this.router.delete(path, this.executeAction(action))
    }

    all(path: string, action: Route) {
        this.router.all(path, this.executeAction(action))
    }

    private executeAction = (action: Route) =>
        async (req: Request, res: Response) => {
            const result = await action.execute(req)
            res.status(result.statusCode).json(result.data)
        }

    private registerAction(action: Route) {
        action.register(this)
    }
}