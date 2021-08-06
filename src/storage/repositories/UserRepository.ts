import { Datastore } from '../datastores/Datastore.js'
import { User } from '../../models/user/User.js'
import { UserMapper } from '../storables/UserMapper.js'
import { UserDto } from '../../models/user/UserDto.js'
import { UserField } from '../../models/user/UserField.js'
import { Identified } from '../datastores/Identified.js'

export class UserRepository {

    private dataStore: Datastore

    constructor(dataStore: Datastore) {
        this.dataStore = dataStore
    }

    findByUsername(username: string): User[] {
        if (!this.dataStore.hasTable(UserField.TABLE_NAME)) {
            return []
        }
        const result = this.dataStore.find<Identified<UserDto>>(UserField.TABLE_NAME, (user) => {
            return user.username === username
        })

        return result.map(userDto => UserMapper.fromDto(userDto))
    }

}
