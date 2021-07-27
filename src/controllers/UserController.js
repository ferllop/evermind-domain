import { UserRepository } from '../storage/repositories/UserRepository.js'
import { UserMapper } from '../storage/storables/UserMapper.js'
import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class UserController {

    /**
     * @param {object} dto 
     * @param {Datastore} datastore 
     * @returns {Response}
     */
    storeUser(dto, datastore) {
        if (!UserMapper.isDtoValid(dto)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = UserMapper.fromDto(dto)
        const result = new UserRepository(datastore).storeCard(card)
        if (!result) {
            return Response.withError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return Response.OkWithoutData()
    }

    /** 
     * @param {object} dto
     * @returns {Response}
     * */
    deleteUser({id}, datastore) {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const deleted = new UserRepository(datastore).deleteCard(new Identification(id))
        if (!deleted) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return Response.OkWithoutData()
    }

    /** 
     * @param {object} dto
     * @returns {Response}
     */
    retrieveUser({id}, datastore) {
        if(!id) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const retrieved = new UserRepository(datastore).retrieveCard(new Identification(id))
        if (!retrieved) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithData(UserMapper.toDto(retrieved))
    }

    /**
     * @param {object} dto 
     * @returns {Response}
     */
    updateUser(dto, datastore) {
        if (!UserMapper.isDtoValid(dto)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        const card = UserMapper.fromDto(dto)
        const updated = new UserRepository(datastore).updateCard(card)
        if(!updated) {
            return Response.withError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return Response.OkWithoutData()
    }

}
