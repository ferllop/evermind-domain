import {ErrorType} from '../domain/errors/ErrorType.js'
import {UserDto} from '../domain/user/UserDto.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserGetsUserInfoRequest} from './UserGetsUserInfoRequest.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UseCase} from './UseCase.js'
import {DomainError} from '../domain/errors/DomainError.js'

export class UserGetsUserInfoUseCase extends UseCase<UserGetsUserInfoRequest, UserDto|null>{

    protected getRequiredRequestFields(): string[] {
        return ['id']
    }

    protected async internalExecute(request: UserGetsUserInfoRequest) {
        if(!Identification.isValid(request.id)) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        
        const user = await new UserRepository().findById(new Identification(request.id))
        
        if (user.isNull()) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }

        return Response.OkWithData(user.toDto())
    }
}
