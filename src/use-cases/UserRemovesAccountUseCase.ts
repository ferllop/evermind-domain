import {UserRepository} from '../domain/user/UserRepository.js'
import {Response} from './Response.js'
import {UserRemovesAccountRequest} from '../types/requests/UserRemovesAccountRequest.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'

export class UserRemovesAccountUseCase extends WithAuthorizationUseCase<UserRemovesAccountRequest, null> {

    constructor() {
        super(['userId'])
    }

    protected async internalExecute(request: UserRemovesAccountRequest): Promise<Response<null>> {
        const userRepository = await new UserRepository()
        const user = await userRepository.findById(UserIdentification.recreate(request.userId))
        await userRepository.delete(user, await this.getRequesterPermissions())
        return Response.OkWithoutData()
    }

}
