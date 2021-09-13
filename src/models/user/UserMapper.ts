import { precondition } from '../../lib/preconditions.js'
import { User } from '../../models/user/User.js'
import { UserDto } from '../../models/user/UserDto.js'
import { Mapper } from '../Mapper.js'
import { Identification } from '../../models/value/Identification.js'
import { MayBeIdentified } from '../value/MayBeIdentified.js'
import { DayStartTime } from '../../models/value/DayStartTime.js'
import { PersonName } from '../../models/user/PersonName.js'
import { Username } from '../../models/user/Username.js'
import { Validator } from '../Validator.js'
import { UserIdentification } from './UserIdentification.js'

export class UserMapper extends Mapper<User, UserDto> {
    getValidators(): Map<string, Validator> {
        return new Map()
            .set('id', UserIdentification.isValid)
            .set('name', PersonName.isValid)
            .set('username', Username.isValid)
            .set('dayStartTime', DayStartTime.isValid)
    }

    isDtoValid(dto: MayBeIdentified<UserDto>): boolean {
        return Boolean(dto) &&
            User.isValid(
                dto.name,
                dto.username,
                dto.dayStartTime,
                'id' in dto ? dto.id : undefined
            )
    }

    fromDto(dto: UserDto): User {
        precondition(this.isDtoValid(dto))
        return User.recreate(
            new PersonName(dto.name), 
            new Username(dto.username), 
            new DayStartTime(dto.dayStartTime), 
            new Identification(dto.id))
    }

    toDto(user: User): UserDto {
        return {
            id: user.getId().getId(),
            name: user.getName().toString(),
            username: user.getUsername().toString(),
            dayStartTime: user.getDayStartTime().getValue()
        }
    }


    getNull() {
        return User.NULL
    }
}
