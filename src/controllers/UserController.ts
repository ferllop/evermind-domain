import { UserRepository } from '../models/user/UserRepository.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../models/Datastore.js'
import { User } from '../models/user/User.js'
import { DomainError } from '../errors/DomainError.js'
import { UserDto } from '../models/user/UserDto.js'
import { OnlyRequired } from '../helpers/OnlyRequired.js'
import { UserIdentification } from '../models/user/UserIdentification.js'

export class UserController {

    storeUser(user: User, datastore: Datastore): DomainError {
        return new UserRepository(datastore).store(user)
    }

    deleteUser(id: Identification, datastore: Datastore): DomainError {
        const userRepository = new UserRepository(datastore)
        const user = userRepository.retrieve(id)
        if (user.isNull()) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }
        const error = new UserRepository(datastore).delete(user)
        return error
    }

    retrieveUser(id: Identification, datastore: Datastore): DomainError | User {
        const user = new UserRepository(datastore).retrieve(id)
        return user.isNull() ? new DomainError(ErrorType.USER_NOT_FOUND) : user
    }

    updateUser(userDto: OnlyRequired<UserDto, 'id'>, datastore: Datastore): DomainError {
        const {id, ...userData} = userDto
        const userRepository = new UserRepository(datastore)
        const user = userRepository.retrieve(new UserIdentification(id))
        
        if(user.isNull()) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }

        return userRepository.update(user.apply(userData))
    }

    findByUsername(username: string, datastore: Datastore): DomainError | User {
        const user = new UserRepository(datastore).findByUsername(username)
        if (user.isNull()) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }
        return user
    }

    findById(id: Identification, datastore: Datastore): DomainError | User {
        const user = new UserRepository(datastore).findById(id)
        if (!user) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }
        return user
    }
}
