import { UserRepository } from '../storage/repositories/UserRepository.js'
import { UserMapper } from '../storage/storables/UserMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'
import { UserDto } from '../models/user/UserDto.js'
import { User } from '../models/user/User.js'
import { DomainError } from '../errors/DomainError.js'
import { IdDto } from '../models/value/IdDto.js'

export class UserController {

    storeUser(dto: UserDto, datastore: Datastore): DomainError {
        if (!UserMapper.isDtoValid(dto)) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const user = UserMapper.fromDto({id: '', ...dto})
        const result = new UserRepository(datastore).storeUser(user)
        if (!result) {
            return new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return DomainError.NULL
    }

    deleteUser({id}: IdDto, datastore: Datastore): DomainError {
        if(!id) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const deleted = new UserRepository(datastore).deleteUser(new Identification(id))
        if (!deleted) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return DomainError.NULL
    }

    retrieveUser({id}: IdDto, datastore: Datastore): DomainError | User {
        if(!id) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const retrievedUser = new UserRepository(datastore).retrieveUser(new Identification(id))
        if (!retrievedUser) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return retrievedUser
    }

    updateUser(dto: Identified<UserDto>, datastore: Datastore): DomainError {
        if (!UserMapper.isDtoValid(dto)) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = UserMapper.fromDto(dto)
        const updated = new UserRepository(datastore).updateUser(card)
        if(!updated) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return DomainError.NULL
    }

    findByUsername(username: string, datastore: Datastore): Response<User[]> {
        const result = new UserRepository(datastore).findByUsername(username)
        if (result.length === 0) {
            new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithData<User[]>(result)
    }
}
