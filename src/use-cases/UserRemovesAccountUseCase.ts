import {ErrorType} from '../domain/errors/ErrorType.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserRemovesAccountRequest} from './UserRemovesAccountRequest.js'
import {UseCase} from './UseCase.js'
import {DomainError} from '../domain/errors/DomainError.js'

export class UserRemovesAccountUseCase extends UseCase<UserRemovesAccountRequest, null> {
    protected getRequiredRequestFields(): string[] {
        return ['id']
    }

    protected async internalExecute(request: UserRemovesAccountRequest): Promise<Response<null>> {
        if (!Identification.isValid(request.id)) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const userRepository = await new UserRepository()
        const user = await userRepository.findById(new Identification(request.id))
        if (user.isNull()) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }
        await new UserRepository().delete(user)

        return Response.OkWithoutData()
    }

}
