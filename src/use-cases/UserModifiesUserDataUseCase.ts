import { ErrorType } from '../models/errors/ErrorType.js'
import { Datastore } from '../models/Datastore.js';
import { UserIdentification } from '../models/user/UserIdentification.js';
import { UserMapper } from '../models/user/UserMapper.js'
import { UserRepository } from '../models/user/UserRepository.js';
import { Response } from './Response.js';
import { UserModifiesUserDataRequest } from './UserModifiesUserDataRequest.js'

export class UserModifiesUserDataUseCase {
    
    execute(dto: UserModifiesUserDataRequest, datastore: Datastore): Response<null> {
        const mapper = new UserMapper()
        if (!mapper.arePropertiesValid(dto)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }

        const {id, ...userData} = dto
        const userRepository = new UserRepository(datastore)
        const user = userRepository.retrieve(new UserIdentification(id))
        
        if(user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        const error = userRepository.update(user.apply(userData))
        return new Response(error.getCode(), null)
    }

}
