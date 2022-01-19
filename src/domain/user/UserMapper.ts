import {User} from './User.js'
import {Validator} from '../shared/Validator.js'
import {DayStartTime} from '../shared/value/DayStartTime.js'
import {Identification} from '../shared/value/Identification.js'
import {MayBeIdentified} from '../shared/value/MayBeIdentified.js'
import {PersonName} from './PersonName.js'
import {UserDto} from './UserDto.js'
import {UserIdentification} from './UserIdentification.js'
import {Username} from './Username.js'
import {precondition} from '../../implementations/preconditions.js'
import {EntityFactory} from '../shared/EntityFactory'

export class UserMapper extends EntityFactory<User, UserDto> {

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

}
