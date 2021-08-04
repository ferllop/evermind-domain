import { UserController } from '../controllers/UserController.js'
import { DomainError } from '../errors/DomainError.js'
import { UserDto } from '../models/user/UserDto.js'
import { IdDto } from '../models/value/IdDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { UserMapper } from '../storage/storables/UserMapper.js'

export class ReadUserUseCase {

    execute(dto: IdDto, datastore: Datastore): Response<UserDto|null> {
        const result = new UserController().retrieveUser(dto, datastore)

        if (result instanceof DomainError) {
            return new Response(result.getType(), null)
        }

        return new Response(null, UserMapper.toDto(result))

    }
}
