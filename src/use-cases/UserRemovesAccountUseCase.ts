import { ErrorType } from '../models/errors/ErrorType.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from './Response.js';
import { UserRemovesAccountRequest } from './UserRemovesAccountRequest.js';

export class UserRemovesAccountUseCase {
    
    execute(request: UserRemovesAccountRequest): Response<null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const userRepository = new UserRepository()
        const user = userRepository.findById(new Identification(request.id))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }
        const error = new UserRepository().delete(user)
        return new Response(error.getCode(), null)
    }
    
}
