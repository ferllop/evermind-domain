import { UserController } from '../controllers/UserController.js'
import { UserDto } from '../models/user/UserDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'

export class UpdateUserUseCase {
    
    execute(dto: Identified<UserDto>, datastore: Datastore): Response<null> {
        const error = new UserController().updateUser(dto, datastore)
        return new Response(error.getType(), null)
    }

}
