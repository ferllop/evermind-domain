import { UserController } from '../controllers/UserController.js'
import { UserDto } from '../models/user/UserDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'

export class ReadUserUseCase {
    execute(dto: Identified, datastore: Datastore): Response<UserDto|null> {
        return new UserController().retrieveUser(dto, datastore)
    }
}
