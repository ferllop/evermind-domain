import { UserController } from '../controllers/UserController.js'
import { IdDto } from '../models/value/IdDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class DeleteUserUseCase {
    
    execute(dto: IdDto, datastore: Datastore): Response<null> {
        const error = new UserController().deleteUser(dto, datastore)
        return new Response(error.getType(), null)
    }
    
}
