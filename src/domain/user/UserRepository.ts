import {User} from './User.js'
import {UserDto} from './UserDto.js'
import {UserField} from './UserField.js'
import {NullUser} from './NullUser.js'
import {UserMapper} from './UserMapper.js'
import {Repository} from '../shared/Repository.js'
import {ErrorType} from '../errors/ErrorType.js'
import {DomainError} from '../errors/DomainError.js'

export class UserRepository extends Repository<User, UserDto> {

    constructor() {
        super(UserField.TABLE_NAME, new UserMapper())
    }

    override async delete(user: User) {
        if (user.isNull()) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }

        try {
            return await super.delete(user)
        } catch (error) {
            if (error.code() === ErrorType.RESOURCE_NOT_FOUND) {
                throw new DomainError(ErrorType.USER_NOT_FOUND)
            }
            throw error
        }
    }

    getNull() {
        return NullUser.getInstance()
    }

}
