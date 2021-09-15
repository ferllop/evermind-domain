import { ErrorType } from '../models/errors/ErrorType.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../models/Datastore.js';
import { UserRemovesAccountRequest } from './UserRemovesAccountRequest.js'
import { Response } from './Response.js';
import { UserRepository } from '../models/user/UserRepository.js';

export class UserRemovesAccountUseCase {
    
    execute(request: UserRemovesAccountRequest, datastore: Datastore): Response<null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const userRepository = new UserRepository(datastore)
        const user = userRepository.retrieve(new Identification(request.id))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }
        const error = new UserRepository(datastore).delete(user)
        return new Response(error.getCode(), null)
    }
    
}
