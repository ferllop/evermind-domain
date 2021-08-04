import { UserController } from '../controllers/UserController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { UserDto } from '../models/user/UserDto.js'

export class CreateUserUseCase {
    
    execute(dto: UserDto, datastore: Datastore): Response<null> {
        const error = new UserController().storeUser(dto, datastore)
        return new Response(error.getType(), null)
    }

}
