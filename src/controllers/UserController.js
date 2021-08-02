import { UserRepository } from '../storage/repositories/UserRepository.js'
import { UserMapper } from '../storage/storables/UserMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'
import { UserDto } from '../models/user/UserDto.js'

export class UserController {

    /**
     * @param {UserDto} dto 
     * @param {Datastore} datastore 
     * @returns {Response}
     */
    storeUser(dto, datastore) {
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

    /** 
     * @param {Identified} dto
     * @param {Datastore} datastore 
     * @returns {Response}
     * */
    deleteUser({id}, datastore) {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const deleted = new UserRepository(datastore).deleteUser(new Identification(id))
        if (!deleted) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return Response.OkWithoutData()
    }

    /** 
     * @param {Identified} dto
     * @param {Datastore} datastore 
     * @returns {Response}
     */
    retrieveUser({id}, datastore) {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const retrieved = new UserRepository(datastore).retrieveUser(new Identification(id))
        if (!retrieved) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithData(UserMapper.toDto(retrieved))
    }

    /**
     * @param {UserDto} dto 
     * @param {Datastore} datastore 
     * @returns {Response}
     */
    updateUser(dto, datastore) {
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

}
