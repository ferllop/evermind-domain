import { Datastore } from '../datastores/Datastore.js'
import { User } from '../../models/user/User.js'
import { UserMapper } from '../storables/UserMapper.js'
import { UserDto } from '../../models/user/UserDto.js'
import { UserField } from '../../models/user/UserField.js'
import { Identification } from '../../models/value/Identification.js'

export class UserRepository {

    private dataStore: Datastore

    constructor(dataStore: Datastore) {
        this.dataStore = dataStore
    }

    findByUsername(username: string): User|null {
        if (!this.dataStore.hasTable(UserField.TABLE_NAME)) {
            return null
        }
        const result = this.dataStore.findOne<UserDto>(UserField.TABLE_NAME, (user) => {
            return user.username === username
        })
        return result ? new UserMapper().fromDto(result) : null
    }

    findById(id: Identification): User|null {
        if (!this.dataStore.hasTable(UserField.TABLE_NAME)) {
            return null
        }
        const result = this.dataStore.read<UserDto>(UserField.TABLE_NAME, id.getId())

        return result ? new UserMapper().fromDto(result) : null
    }


}
