import { UserRepository } from '../models/user/UserRepository.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../models/Datastore.js'
import { User } from '../models/user/User.js'
import { DomainError } from '../errors/DomainError.js'

export class UserController {

    storeUser(user: User, datastore: Datastore): DomainError {
        return new UserRepository(datastore).store(user)
    }

    deleteUser(id: Identification, datastore: Datastore): DomainError {
        return new UserRepository(datastore).delete(id)
    }

    retrieveUser(id: Identification, datastore: Datastore): DomainError | User {
        return new UserRepository(datastore).retrieve(id)
    }

    updateUser(user: User, datastore: Datastore): DomainError {
        return new UserRepository(datastore).update(user)
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
