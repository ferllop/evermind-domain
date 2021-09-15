import { ErrorType } from '../models/errors/ErrorType.js'
import { UserDto } from '../models/user/UserDto.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../models/Datastore.js';
import { UserMapper } from '../models/user/UserMapper.js'
import { UserGetsUserInfoRequest } from './UserGetsUserInfoRequest.js'
import { Response } from './Response.js'
import { UserRepository } from '../models/user/UserRepository.js'

export class UserGetsUserInfoUseCase {

    execute(request: UserGetsUserInfoRequest, datastore: Datastore): Response<UserDto|null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const user = new UserRepository(datastore).retrieve(new Identification(request.id))
        
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        return Response.OkWithData(new UserMapper().toDto(user))
    }
}
