import { UserController } from '../controllers/UserController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Identification } from '../models/value/Identification.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { UserRemovesAccountRequest } from './UserRemovesAccountRequest.js'

export class UserRemovesAccountUseCase {
    
    execute(request: UserRemovesAccountRequest, datastore: Datastore): Response<null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const id = new Identification(request.id)
        const error = new UserController().deleteUser(id, datastore)
        return new Response(error.getType(), null)
    }
    
}
