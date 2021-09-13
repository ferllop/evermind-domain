import { UserController } from '../controllers/UserController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'
import { UserDto } from '../models/user/UserDto.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../models/Datastore.js';
import { UserMapper } from '../models/user/UserMapper.js'
import { UserGetsUserInfoRequest } from './UserGetsUserInfoRequest.js'
import { Response } from './Response.js'

export class UserGetsUserInfoUseCase {

    execute(request: UserGetsUserInfoRequest, datastore: Datastore): Response<UserDto|null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const id = new Identification(request.id)
        
        const result = new UserController().retrieveUser(id, datastore)

        if (result instanceof DomainError) {
            return new Response(result.getCode(), null)
        }

        return Response.OkWithData(new UserMapper().toDto(result))

    }
}
