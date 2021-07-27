import { UserController } from '../controllers/UserController.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class DeleteUserUseCase {
    /**
     * @param {object} dto 
     * @param {Datastore} datastore
     * @returns {object}
     */
    execute(dto, datastore) {
        return new UserController().deleteUser(dto, datastore)
    }
}
