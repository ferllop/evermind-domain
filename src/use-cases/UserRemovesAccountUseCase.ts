import { UserController } from '../controllers/UserController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../models/Datastore.js';
import { UserRemovesAccountRequest } from './UserRemovesAccountRequest.js'
import { Response } from './Response.js';

export class UserRemovesAccountUseCase {
    
    execute(request: UserRemovesAccountRequest, datastore: Datastore): Response<null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const id = new Identification(request.id)
        const error = new UserController().deleteUser(id, datastore)
        return new Response(error.getCode(), null)
    }
    
}
