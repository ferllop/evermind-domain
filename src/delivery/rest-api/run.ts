import {App} from './app.js'
import {UserRouter} from './routers/UserRouter.js'
import {CardRouter} from './routers/CardRouter.js'

const hostname = '127.0.0.1'
const port = Number(process.env.PORT ?? 3000)

new App(new UserRouter(), new CardRouter()).start(port, hostname)