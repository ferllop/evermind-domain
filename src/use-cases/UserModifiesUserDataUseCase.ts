import { UserController } from '../controllers/UserController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../models/Datastore.js';
import { UserMapper } from '../models/user/UserMapper.js'
import { Response } from './Response.js';
import { UserModifiesUserDataRequest } from './UserModifiesUserDataRequest.js'

export class UserModifiesUserDataUseCase {
    
    execute(dto: UserModifiesUserDataRequest, datastore: Datastore): Response<null> {
        const mapper = new UserMapper()
        if (!mapper.arePropertiesValid(dto)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const error = new UserController().updateUser(dto, datastore)
        return new Response(error.getCode(), null)
    }

}


