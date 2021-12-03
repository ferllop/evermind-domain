import {User} from './User.js'
import {UserDto} from './UserDto.js'
import {UserField} from './UserField.js'
import {NullUser} from './NullUser.js'
import {UserMapper} from './UserMapper.js'
import {Repository} from '../Repository.js'
import {ErrorType} from '../errors/ErrorType.js'
import {DomainError} from '../errors/DomainError.js'

export class UserRepository extends Repository<User, UserDto> {

    constructor() {
        super(UserField.TABLE_NAME, new UserMapper())
    }

    override async delete(user: User) {
        if (user.isNull()) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }

        const result = await super.delete(user)
        if (result.getCode() === ErrorType.RESOURCE_NOT_FOUND) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }
        return result
    }

    getNull() {
        return NullUser.getInstance()
    }
    
}
