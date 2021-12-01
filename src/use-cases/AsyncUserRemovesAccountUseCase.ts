import { ErrorType } from '../models/errors/ErrorType.js';
import { AsyncUserRepository } from '../models/user/AsyncUserRepository.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from './Response.js';
import { UserRemovesAccountRequest } from './UserRemovesAccountRequest.js';

export class AsyncUserRemovesAccountUseCase {
    
    async execute(request: UserRemovesAccountRequest): Promise<Response<null>> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const userRepository = await new AsyncUserRepository()
        const user = await userRepository.findById(new Identification(request.id))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }
        const error = await new AsyncUserRepository().delete(user)
        return new Response(error.getCode(), null)
    }
    
}
