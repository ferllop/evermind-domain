import { ErrorType } from '../domain/errors/ErrorType.js'
import { UserRepository } from '../domain/user/UserRepository.js'
import { Identification } from '../domain/shared/value/Identification.js'
import { Response } from './Response.js'
import { UserRemovesAccountRequest } from './UserRemovesAccountRequest.js'
import {UseCase} from './UseCase.js'

export class UserRemovesAccountUseCase extends UseCase<UserRemovesAccountRequest, null>{
    protected getRequiredRequestFields(): string[] {
        return ['id']
    }
    
    protected async internalExecute(request: UserRemovesAccountRequest): Promise<Response<null>> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const userRepository = await new UserRepository()
        const user = await userRepository.findById(new Identification(request.id))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        try {
            await new UserRepository().delete(user)
            return Response.OkWithoutData()
        } catch(error) {
            return Response.withError(error)
        }

    }
    
}
