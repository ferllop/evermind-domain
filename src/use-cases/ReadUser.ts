import { UserController } from '../controllers/UserController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'
import { UserDto } from '../models/user/UserDto.js'
import { IdDto } from '../models/value/IdDto.js'
import { Identification } from '../models/value/Identification.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { UserMapper } from '../storage/storables/UserMapper.js'

export class ReadUserUseCase {

    execute(dto: IdDto, datastore: Datastore): Response<UserDto|null> {
        if(!Identification.isValid(dto.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const id = new Identification(dto.id)
        
        const result = new UserController().retrieveUser(id, datastore)

        if (result instanceof DomainError) {
            return new Response(result.getType(), null)
        }

        return new Response(null, new UserMapper().toDto(result))

    }
}
