import {UserRepository} from '../domain/user/UserRepository.js'
import {PersonName} from '../domain/user/PersonName.js'
import {Username} from '../domain/user/Username.js'
import {Response} from './Response.js'
import {UserSignsUpRequest} from './UserSignsUpRequest.js'
import {UserFactory} from '../domain/user/UserFactory.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {UserDto} from '../domain/user/UserDto.js'

export class UserSignsUpUseCase extends UseCase<UserSignsUpRequest, UserDto> {

    constructor() {
        super(['name', 'username'])
    }

    protected async internalExecute(request: UserSignsUpRequest) {
        if (!PersonName.isValid(request.name) || !Username.isValid(request.username)) {
            throw new InputDataNotValidError()
        }

        const user = new UserFactory().create(new PersonName(request.name), new Username(request.username))
        await new UserRepository().add(user)

        return Response.OkWithData(user.toDto())
    }

}
