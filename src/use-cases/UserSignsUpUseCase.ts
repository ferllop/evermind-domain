import { ErrorType } from '../models/errors/ErrorType.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { PersonName } from '../models/user/PersonName.js';
import { User } from '../models/user/User.js';
import { Username } from '../models/user/Username.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { Response } from './Response.js';
import { UserSignsUpRequest } from './UserSignsUpRequest.js';

export class UserSignsUpUseCase {
    
    async execute(request: UserSignsUpRequest): Promise<Response<null>> {
        if (!PersonName.isValid(request.name) || !Username.isValid(request.username)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const user = User.create(new PersonName(request.name), new Username(request.username))
        const error = await new UserRepository().add(user)
        return new Response(error.getCode(), null)
    }

}
