import express from 'express'
import {Router} from './routers/Router.js'
import {NotFoundRouter} from './routers/NotFoundRouter.js'

export class App {
    protected express: express.Application

    constructor(...routers: Router[]){
        this.express = express()
        this.express.use(express.json())
        this.setRouters(...routers)
    }

    setRouters(...routers: Router[]){
        routers.forEach(router => {
            router.registerIn(this.express)
        })
        new NotFoundRouter().registerIn(this.express)
    }

    start(port: number, hostname: string) {
        this.express.listen(port, hostname, () => {
            console.log(`Listening on http://${hostname}:${port}...`)
        })
    }
}

