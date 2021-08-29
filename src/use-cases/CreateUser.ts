import { UserController } from '../controllers/UserController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { User } from '../models/user/User.js'
import { CreateUserRequest } from './CreateUserRequest'
import { Username } from '../models/user/Username.js'
import { PersonName } from '../models/user/PersonName.js'
import { ErrorType } from '../errors/ErrorType.js'

export class CreateUserUseCase {
    
    execute(dto: CreateUserRequest, datastore: Datastore): Response<null> {
        if (!PersonName.isValid(dto.name) || !Username.isValid(dto.username)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const user = User.create(new PersonName(dto.name), new Username(dto.username))
        const error = new UserController().storeUser(user, datastore)
        return new Response(error.getType(), null)
    }

}


