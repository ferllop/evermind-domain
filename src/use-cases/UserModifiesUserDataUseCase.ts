import {UserRepository} from '../domain/user/UserRepository.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'
import {UserFactory} from '../domain/user/UserFactory.js'
import {Response} from './Response.js'
import {UserModifiesUserDataRequest} from './UserModifiesUserDataRequest.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../domain/errors/UserNotFoundError.js'

export class UserModifiesUserDataUseCase extends UseCase<UserModifiesUserDataRequest, null> {
    protected getRequiredRequestFields(): string[] {
        return ['id']
    }

    protected async internalExecute(dto: UserModifiesUserDataRequest) {
        const mapper = new UserFactory()
        if (!mapper.arePropertiesValid(dto)) {
            throw new InputDataNotValidError()
        }

        const {id, ...userData} = dto
        const userRepository = new UserRepository()
        const user = await userRepository.findById(new UserIdentification(id))
        if (user.isNull()) {
            throw new UserNotFoundError()
        }
        await userRepository.update(new UserFactory().apply(user, userData))

        return Response.OkWithoutData()
    }

}
