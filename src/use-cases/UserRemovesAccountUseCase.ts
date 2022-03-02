import {UserRepository} from '../domain/user/UserRepository.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserRemovesAccountRequest} from './UserRemovesAccountRequest.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../domain/errors/UserNotFoundError.js'

export class UserRemovesAccountUseCase extends UseCase<UserRemovesAccountRequest, null> {

    constructor() {
        super(['id'])
    }

    protected async internalExecute(request: UserRemovesAccountRequest): Promise<Response<null>> {
        if (!Identification.isValid(request.id)) {
            throw new InputDataNotValidError()
        }

        const userRepository = await new UserRepository()
        const user = await userRepository.findById(new Identification(request.id))
        if (user.isNull()) {
            throw new UserNotFoundError()
        }
        await new UserRepository().delete(user)

        return Response.OkWithoutData()
    }

}
