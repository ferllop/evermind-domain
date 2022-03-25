import {UserDto} from '../domain/user/UserDto.js'
import {Response} from './Response.js'
import {UserGetsUserInfoRequest} from './UserGetsUserInfoRequest.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'

export class UserGetsUserInfoUseCase extends WithAuthorizationUseCase<UserGetsUserInfoRequest, UserDto|null>{

    constructor() {
        super(['userId'])
    }

    protected async internalExecute(request: UserGetsUserInfoRequest) {
        const userId = UserIdentification.recreate(request.userId)
        const requesterPermissions = await this.getRequesterPermissions()
        const user = await new UserRepository().getById(userId, requesterPermissions)
        return Response.OkWithData(user.toDto())
    }
}
