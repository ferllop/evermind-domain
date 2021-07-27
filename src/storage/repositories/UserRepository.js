import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'
import { User } from '../../models/user/User.js'
import { UserMapper } from '../storables/UserMapper.js'

export class UserRepository {
    static TABLE_NAME = 'users'

    /** @type {Datastore} */
    #dataStore

    constructor(dataStore) {
        this.#dataStore = dataStore
    }

    /**
     * @param {User} user 
     * @returns {Boolean}
     */
    storeUser(user) {
        return this.#dataStore.create(UserRepository.TABLE_NAME, UserMapper.toDto(user))
    }

    /** 
     * @param {Identification} id
     * @returns {boolean}
     * */
    deleteCard(id) {
        if (! this.#dataStore.hasTable(UserRepository.TABLE_NAME)) {
            return false
        }
        return this.#dataStore.delete(UserRepository.TABLE_NAME, id.toString())
    }

    /** 
     * @param {Identification} id
     * @returns {User}
     */
    retrieveCard(id) {
        if (!this.#dataStore.hasTable(UserRepository.TABLE_NAME)) {
            return null
        }
        const result = this.#dataStore.read(UserRepository.TABLE_NAME, id.toString())
        if (!result || !UserMapper.isDtoValid(result)) {
            return null
        }
        return UserMapper.fromDto(result)
    }

    /**
     * @param {User} user 
     * @returns {boolean}
     */
    updateCard(user) {
        if (!this.#dataStore.hasTable(UserRepository.TABLE_NAME)) {
            return false
        }
        return this.#dataStore.update(UserRepository.TABLE_NAME, UserMapper.toDto(user))
    }

}
