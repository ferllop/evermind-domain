import { UserController } from '../controllers/UserController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { UserDto } from '../models/user/UserDto.js'

export class CreateUserUseCase {
    /**
     * @param {UserDto} dto 
     * @param {Datastore} datastore
     * @returns {Response}
     */
    execute(dto, datastore) {
        return new UserController().storeUser(dto, datastore)
    }
}
