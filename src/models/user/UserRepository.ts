import { User } from '../../models/user/User.js'
import { UserDto } from '../../models/user/UserDto.js'
import { UserField } from '../../models/user/UserField.js'
import { Repository } from '../Repository.js'
import { NullUser } from './NullUser.js'
import { UserMapper } from './UserMapper.js'

export class UserRepository extends Repository<User, UserDto> {

    constructor() {
        super(UserField.TABLE_NAME, new UserMapper())
    }

    getNull() {
        return NullUser.getInstance()
    }
    
}
