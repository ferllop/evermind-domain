import {UserDto} from '../domain/user/UserDto.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserGetsUserInfoRequest} from './UserGetsUserInfoRequest.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../domain/errors/UserNotFoundError.js'

export class UserGetsUserInfoUseCase extends UseCase<UserGetsUserInfoRequest, UserDto|null>{

    constructor() {
        super(['id'])
    }

    protected async internalExecute(request: UserGetsUserInfoRequest) {
        if(!Identification.isValid(request.id)) {
            throw new InputDataNotValidError()
        }
        
        const user = await new UserRepository().findById(new Identification(request.id))
        
        if (user.isNull()) {
            throw new UserNotFoundError()
        }

        return Response.OkWithData(user.toDto())
    }
}
