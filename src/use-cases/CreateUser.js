import { UserController } from '../controllers/UserController.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class CreateUserUseCase {
    /**
     * @param {object} dto 
     * @param {Datastore} datastore
     * @returns {object}
     */
    execute(dto, datastore) {
        return new UserController().storeUser(dto, datastore)
    }
}
