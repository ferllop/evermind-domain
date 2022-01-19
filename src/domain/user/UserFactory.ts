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

export class UserFactory extends EntityFactory<User, UserDto> {

    private userConstructor = User.prototype.constructor as { new(name: PersonName, username: Username, dayStartTime: DayStartTime, id: UserIdentification): User}

    getValidators(): Map<string, Validator> {
        return new Map()
            .set('id', UserIdentification.isValid)
            .set('name', PersonName.isValid)
            .set('username', Username.isValid)
            .set('dayStartTime', DayStartTime.isValid)
    }

    isValid(name: string, username: string, dayStartTime: number, id?: string): boolean {
        return PersonName.isValid(name) &&
            Username.isValid(username) &&
            DayStartTime.isValid(dayStartTime) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }

    isDtoValid(dto: MayBeIdentified<UserDto>): boolean {
        return Boolean(dto) &&
            new UserFactory().isValid(dto.name, dto.username, dto.dayStartTime, 'id' in dto ? dto.id : undefined)
    }

    fromDto(dto: UserDto): User {
        precondition(this.isDtoValid(dto))
        return new UserFactory().recreate(new PersonName(dto.name), new Username(dto.username), new DayStartTime(dto.dayStartTime), new Identification(dto.id))
    }

    create(name: PersonName, username: Username) {
        return new this.userConstructor(name, username, new DayStartTime(), Identification.create())
    }

     recreate(name: PersonName, username: Username, dayStartTime: DayStartTime, id: Identification) {
        return new this.userConstructor(name, username, dayStartTime, id)
    }

}
