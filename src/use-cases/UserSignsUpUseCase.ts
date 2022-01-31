import {ErrorType} from '../domain/errors/ErrorType.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {PersonName} from '../domain/user/PersonName.js'
import {Username} from '../domain/user/Username.js'
import {Response} from './Response.js'
import {UserSignsUpRequest} from './UserSignsUpRequest.js'
import {UserFactory} from '../domain/user/UserFactory.js'
import {UseCase} from './UseCase.js'

export class UserSignsUpUseCase extends UseCase<UserSignsUpRequest, null>{

    protected getRequiredRequestFields(): string[] {
        return ['name', 'username'];
    }
    
    protected async internalExecute(request: UserSignsUpRequest) {
        if (!PersonName.isValid(request.name) || !Username.isValid(request.username)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const user = new UserFactory().create(new PersonName(request.name), new Username(request.username))

        try {
            await new UserRepository().add(user)
            return Response.OkWithoutData()
        } catch(error) {
            return Response.withError(error)
        }

    }

}
