import {UserIdentification} from './UserIdentification.js'
import {UserDto} from './UserDto.js'
import {User} from './User.js'

export class StoredUser extends User {
    constructor(user: User, private readonly id: UserIdentification) {
        super(user.getName(), user.getUsername(), user.getDayStartTime())
    }

    override toDto(): UserDto {
        return {
            ...super.toDto(),
            id: this.getId().getId(),
        }
    }

    getId() {
        return this.id
    }

    isNull() {
        return false
    }
}

