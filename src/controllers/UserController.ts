import { UserRepository } from '../storage/repositories/UserRepository.js'
import { UserMapper } from '../storage/storables/UserMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'
import { UserDto } from '../models/user/UserDto.js'
import { User } from '../models/user/User.js'

export class UserController {

    storeUser(dto: UserDto, datastore: Datastore): Response<null> {
        if (!UserMapper.isDtoValid(dto)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const user = UserMapper.fromDto(dto)
        const result = new UserRepository(datastore).storeUser(user)
        if (!result) {
            return Response.withError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return Response.OkWithoutData()
    }

    deleteUser({id}: Identified, datastore: Datastore): Response<null> {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const deleted = new UserRepository(datastore).deleteUser(new Identification(id))
        if (!deleted) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return Response.OkWithoutData()
    }

    retrieveUser({id}: Identified, datastore: Datastore): Response<UserDto|null> {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const retrieved = new UserRepository(datastore).retrieveUser(new Identification(id))
        if (!retrieved) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithData(UserMapper.toDto(retrieved))
    }

    updateUser(dto: UserDto, datastore: Datastore): Response<null> {
        if (!UserMapper.isDtoValid(dto)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = UserMapper.fromDto(dto)
        const updated = new UserRepository(datastore).updateUser(card)
        if(!updated) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithoutData()
    }

    findByUsername(username: string, datastore: Datastore): Response<User[]> {
        const result = new UserRepository(datastore).findByUsername(username)
        if (result.length === 0) {
            Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithData<User[]>(result)
    }
}
