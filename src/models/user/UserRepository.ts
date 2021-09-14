import { Datastore } from '../Datastore.js'
import { User } from '../../models/user/User.js'
import { UserMapper } from './UserMapper.js'
import { UserDto } from '../../models/user/UserDto.js'
import { UserField } from '../../models/user/UserField.js'
import { Repository } from '../Repository.js'
import { NullUser } from './NullUser.js'

export class UserRepository extends Repository<User, UserDto> {

    constructor(datastore: Datastore) {
        super(UserField.TABLE_NAME, new UserMapper(), datastore)
    }

    getNull() {
        return NullUser.getInstance()
    }
    
}
