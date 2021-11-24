import {User} from './User.js'
import {UserDto} from './UserDto.js'
import {UserField} from './UserField.js'
import {NullUser} from './NullUser.js'
import {UserMapper} from './UserMapper.js'
import {AsyncRepository} from '../AsyncRepository.js'
import {ErrorType} from '../errors/ErrorType.js'
import {DomainError} from '../errors/DomainError.js'

export class AsyncUserRepository extends AsyncRepository<User, UserDto> {

    constructor() {
        super(UserField.TABLE_NAME, new UserMapper())
    }

    override async delete(entity: User) {
        const result = await super.delete(entity)
        if (result.getCode() === ErrorType.RESOURCE_NOT_FOUND) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }
        return result
    }

    getNull() {
        return NullUser.getInstance()
    }
    
}
