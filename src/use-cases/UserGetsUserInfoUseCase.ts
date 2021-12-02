import { ErrorType } from '../models/errors/ErrorType.js';
import { UserDto } from '../models/user/UserDto.js';
import { UserMapper } from '../models/user/UserMapper.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from './Response.js';
import { UserGetsUserInfoRequest } from './UserGetsUserInfoRequest.js';
import {UserRepository} from '../models/user/UserRepository.js'

export class UserGetsUserInfoUseCase {

    async execute(request: UserGetsUserInfoRequest): Promise<Response<UserDto|null>> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const user = await new UserRepository().findById(new Identification(request.id))
        
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        return Response.OkWithData(new UserMapper().toDto(user))
    }
}
