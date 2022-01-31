import {ErrorType} from '../domain/errors/ErrorType.js'
import {UserDto} from '../domain/user/UserDto.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserGetsUserInfoRequest} from './UserGetsUserInfoRequest.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UseCase} from './UseCase.js'

export class UserGetsUserInfoUseCase extends UseCase<UserGetsUserInfoRequest, UserDto|null>{

    protected getRequiredRequestFields(): string[] {
        return ['id']
    }

    protected async internalExecute(request: UserGetsUserInfoRequest) {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const user = await new UserRepository().findById(new Identification(request.id))
        
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        return Response.OkWithData(user.toDto())
    }
}
