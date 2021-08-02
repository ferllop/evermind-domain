import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'
import { User } from '../../models/user/User.js'
import { UserMapper } from '../storables/UserMapper.js'
import { UserDto } from '../../models/user/UserDto.js'

export class UserRepository {
    static TABLE_NAME = 'users'

    private dataStore: Datastore

    constructor(dataStore: Datastore) {
        this.dataStore = dataStore
    }

    storeUser(user: User): boolean {
        return this.dataStore.create(UserRepository.TABLE_NAME, UserMapper.toDto(user))
    }

    deleteUser(id: Identification): boolean {
        if (! this.dataStore.hasTable(UserRepository.TABLE_NAME)) {
            return false
        }
        return this.dataStore.delete(UserRepository.TABLE_NAME, id.toString())
    }

    retrieveUser(id: Identification): User | null {
        if (!this.dataStore.hasTable(UserRepository.TABLE_NAME)) {
            return null
        }
        const result = this.dataStore.read<UserDto>(UserRepository.TABLE_NAME, id.toString())
        if (!result || !UserMapper.isDtoValid(result)) {
            return null
        }
        return UserMapper.fromDto(result)
    }

    updateUser(user: User): boolean {
        if (!this.dataStore.hasTable(UserRepository.TABLE_NAME)) {
            return false
        }
        return this.dataStore.update(UserRepository.TABLE_NAME, UserMapper.toDto(user))
    }

}
