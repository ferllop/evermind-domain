import {ErrorType} from '../domain/errors/ErrorType.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'
import {UserFactory} from '../domain/user/UserFactory.js'
import {Response} from './Response.js'
import {UserModifiesUserDataRequest} from './UserModifiesUserDataRequest.js'
import {UseCase} from './UseCase.js'
import {DomainError} from '../domain/errors/DomainError.js'

export class UserModifiesUserDataUseCase extends UseCase<UserModifiesUserDataRequest, null> {
    protected getRequiredRequestFields(): string[] {
        return ['id']
    }

    protected async internalExecute(dto: UserModifiesUserDataRequest) {
        const mapper = new UserFactory()
        if (!mapper.arePropertiesValid(dto)) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const {id, ...userData} = dto
        const userRepository = new UserRepository()
        const user = await userRepository.findById(new UserIdentification(id))
        if (user.isNull()) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }
        await userRepository.update(user.apply(userData))

        return Response.OkWithoutData()
    }

}
