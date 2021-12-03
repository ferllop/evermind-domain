import { ErrorType } from '../domain/errors/ErrorType.js';
import { UserRepository } from '../domain/user/UserRepository.js';
import { UserIdentification } from '../domain/user/UserIdentification.js';
import { UserMapper } from '../domain/user/UserMapper.js';
import { UserRepository } from '../domain/user/UserRepository.js';
import { Response } from './Response.js';
import { UserModifiesUserDataRequest } from './UserModifiesUserDataRequest.js';

export class UserModifiesUserDataUseCase {
    
    async execute(dto: UserModifiesUserDataRequest): Promise<Response<null>> {
        const mapper = new UserMapper()
        if (!mapper.arePropertiesValid(dto)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }

        const {id, ...userData} = dto
        
        const userRepository = new UserRepository()
        const user = await userRepository.findById(new UserIdentification(id))
        
        if(user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        const error = await userRepository.update(user.apply(userData))
        return new Response(error.getCode(), null)
    }

}
