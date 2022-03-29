import {UserRepository} from '../domain/user/UserRepository.js'
import {PersonName} from '../domain/user/PersonName.js'
import {Username} from '../domain/user/Username.js'
import {Response} from './Response.js'
import {UserSignsUpRequest} from './UserSignsUpRequest.js'
import {UserDto} from '../domain/user/UserDto.js'
import {MayBeWithAuthorizationUseCase} from './MayBeWithAuthorizationUseCase.js'
import {UserAuthorization} from '../domain/authorization/permission/UserAuthorization.js'
import {CreateUserCommand} from '../domain/user/CreateUserCommand.js'

export class UserSignsUpUseCase extends MayBeWithAuthorizationUseCase<UserSignsUpRequest, UserDto> {

    constructor() {
        super(['name', 'username'])
    }

    protected async internalExecute(request: UserSignsUpRequest) {
        const authorization = new UserAuthorization(await this.getUserPermissions(request))
        const user = await new CreateUserCommand(authorization)
            .create(PersonName.create(request.name), Username.create(request.username))
        await new UserRepository().add(user)

        return Response.OkWithData(user.toDto())
    }

}
