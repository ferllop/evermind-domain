import { UserRepository } from '../storage/repositories/UserRepository.js'
import { UserMapper } from '../storage/storables/UserMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { UserDto } from '../models/user/UserDto.js'
import { User } from '../models/user/User.js'
import { DomainError } from '../errors/DomainError.js'
import { UserField } from '../models/user/UserField.js'
import { CrudController } from './CrudController.js'

export class UserController {

    private crudController() {
        return new CrudController<User, UserDto>(UserField.TABLE_NAME, new UserMapper())
    }

    storeUser(user: User, datastore: Datastore): DomainError {
        return new UserRepository(datastore).store(user)
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

    findByUsername(username: string, datastore: Datastore): DomainError | User {
        const user = new UserRepository(datastore).findByUsername(username)
        if (!user) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return user
    }

    findById(id: Identification, datastore: Datastore): DomainError | User {
        const user = new UserRepository(datastore).findById(id)
        if (!user) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return user
    }
}
