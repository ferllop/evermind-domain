import {UserRepository} from '../domain/user/UserRepository.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'
import {UserFactory} from '../domain/user/UserFactory.js'
import {Response} from './Response.js'
import {UserModifiesUserDataRequest} from './UserModifiesUserDataRequest.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'

export class UserModifiesUserDataUseCase extends WithAuthorizationUseCase<UserModifiesUserDataRequest, null> {

    constructor() {
        super(['id', 'name', 'username', 'dayStartTime'])
    }

    protected async internalExecute(request: UserModifiesUserDataRequest) {
        const {requesterId, ...userData} = request
        const userRepository = new UserRepository()
        const user = await userRepository.findById(UserIdentification.recreate(userData.id))
        const updatedUser = new UserFactory().apply(user, userData, await this.getRequesterPermissions())
        await userRepository.update(updatedUser)
        return Response.OkWithoutData()
    }

}
