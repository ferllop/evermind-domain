import {ErrorType} from '../models/errors/ErrorType.js'
import {Identification} from '../models/value/Identification.js'
import {Response} from './Response.js'
import {UserRemovesAccountRequest} from './UserRemovesAccountRequest.js'
import {AsyncUserRepository} from '../models/user/AsyncUserRepository.js'

export class AsyncUserRemovesAccountUseCase {
    
    async execute(request: UserRemovesAccountRequest): Promise<Response<null>> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const userRepository = new AsyncUserRepository()
        const user = await userRepository.retrieve(new Identification(request.id))
        const error = await userRepository.delete(user)
        return new Response(error.getCode(), null)
    }
    
}
