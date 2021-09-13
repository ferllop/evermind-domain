import { Datastore } from '../Datastore.js'
import { User } from '../../models/user/User.js'
import { UserMapper } from './UserMapper.js'
import { UserDto } from '../../models/user/UserDto.js'
import { UserField } from '../../models/user/UserField.js'
import { Identification } from '../../models/value/Identification.js'
import { Repository } from '../Repository.js'

export class UserRepository extends Repository<User, UserDto> {

    constructor(datastore: Datastore) {
        super(UserField.TABLE_NAME, new UserMapper(), datastore)
    }

    findByUsername(username: string): User {
        if (!this.datastore.hasTable(UserField.TABLE_NAME)) {
            return User.NULL
        }
        const result = this.datastore.findOne<UserDto>(UserField.TABLE_NAME, (user) => {
            return user.username === username
        })
        return result ? new UserMapper().fromDto(result) : User.NULL
    }

    findById(id: Identification): User {
        if (!this.datastore.hasTable(UserField.TABLE_NAME)) {
            return User.NULL
        }
        const result = this.datastore.read<UserDto>(UserField.TABLE_NAME, id.getId())

        return result ? new UserMapper().fromDto(result) : User.NULL
    }


}
