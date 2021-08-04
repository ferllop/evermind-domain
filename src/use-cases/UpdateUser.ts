import { UserController } from '../controllers/UserController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { UserDto } from '../models/user/UserDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'
import { UserMapper } from '../storage/storables/UserMapper.js'

export class UpdateUserUseCase {
    
    execute(dto: Identified<UserDto>, datastore: Datastore): Response<null> {
        if (!UserMapper.isDtoValid(dto)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const user = UserMapper.fromDto(dto)
        const error = new UserController().updateUser(user, datastore)
        return new Response(error.getType(), null)
    }

}
