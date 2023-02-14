import {UserRepository} from '../domain/user/UserRepository.js'
import {PersonName} from '../domain/user/PersonName.js'
import {Username} from '../domain/user/Username.js'
import {Response} from './Response.js'
import {UserSignsUpRequest} from './UserSignsUpRequest.js'
import {UserDto} from '../types/dtos/UserDto.js'
import {MayBeWithAuthorizationUseCase} from './MayBeWithAuthorizationUseCase.js'
import {UserFactory} from '../domain/user/UserFactory.js'
import {CreateUserAccount} from '../domain/authorization/permission/permissions/CreateUserAccount.js'

export class UserSignsUpUseCase extends MayBeWithAuthorizationUseCase<UserSignsUpRequest, UserDto> {

    constructor() {
        super(['name', 'username'])
    }

    protected async internalExecute(request: UserSignsUpRequest) {
        (await this.getAuthorization()).assertCan(CreateUserAccount)
        const user = new UserFactory().create(PersonName.create(request.name), Username.create(request.username))
        const storedUser = await new UserRepository().add(user)
        return Response.OkWithData(storedUser.toDto())
    }

}
