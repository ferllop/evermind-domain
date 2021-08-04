import { UserController } from '../controllers/UserController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { UserDto } from '../models/user/UserDto.js'
import { UserMapper } from '../storage/storables/UserMapper.js'
import { ErrorType } from '../errors/ErrorType.js'

export class CreateUserUseCase {
    
    execute(dto: UserDto, datastore: Datastore): Response<null> {
        const mapper = new UserMapper()
        if (!mapper.isDtoValid(dto)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const user = UserMapper.fromDto({id: '', ...dto})
        const error = new UserController().storeUser(user, datastore)
        return new Response(error.getType(), null)
    }

}
