import { UserController } from '../controllers/UserController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../models/Datastore.js';
import { User } from '../models/user/User.js'
import { UserSignsUpRequest } from './UserSignsUpRequest.js'
import { Username } from '../models/user/Username.js'
import { PersonName } from '../models/user/PersonName.js'
import { ErrorType } from '../errors/ErrorType.js'

export class UserSignsUpUseCase {
    
    execute(request: UserSignsUpRequest, datastore: Datastore): Response<null> {
        if (!PersonName.isValid(request.name) || !Username.isValid(request.username)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const user = User.create(new PersonName(request.name), new Username(request.username))
        const error = new UserController().storeUser(user, datastore)
        return new Response(error.getType(), null)
    }

}
