import { UserRepository } from '../storage/repositories/UserRepository.js'
import { UserMapper } from '../storage/storables/UserMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { UserDto } from '../models/user/UserDto.js'
import { User } from '../models/user/User.js'
import { DomainError } from '../errors/DomainError.js'
import { UserField } from '../models/user/UserField.js'
import { CrudController } from './CrudController.js'
import { Unidentified } from '../storage/datastores/Unidentified.js'

export class UserController {

    private crudController() {
        return new CrudController<User, UserDto>(UserField.TABLE_NAME, new UserMapper())
    }

    storeUser(userDto: Unidentified<UserDto>, datastore: Datastore): DomainError {
        return this.crudController().store(userDto, datastore)
    }

    deleteUser(id: Identification, datastore: Datastore): DomainError {
        return this.crudController().delete(id, datastore)
    }

    retrieveUser(id: Identification, datastore: Datastore): DomainError | User {
        return this.crudController().retrieve(id, datastore)
    }

    updateUser(user: User, datastore: Datastore): DomainError {
        return this.crudController().update(user, datastore)
    }

    findByUsername(username: string, datastore: Datastore): Response<User[]> {
        const result = new UserRepository(datastore).findByUsername(username)
        if (result.length === 0) {
            new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithData<User[]>(result)
    }
}
