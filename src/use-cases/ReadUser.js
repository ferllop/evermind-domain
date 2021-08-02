import { UserController } from '../controllers/UserController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'

export class ReadUserUseCase {
    /**
     * @param {Identified} dto 
     * @param {Datastore} datastore
     * @returns {Response}
     */
    execute(dto, datastore) {
        return new UserController().retrieveUser(dto, datastore)
    }
}
