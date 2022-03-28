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
import {EntityFactory} from '../shared/EntityFactory.js'
import {InputDataNotValidError} from '../errors/InputDataNotValidError.js'
import {UserPermissionsAuthorization} from '../authorization/permission/UserPermissionsAuthorization.js'
import {UserPermissions} from '../authorization/permission/UserPermissions.js'
import {UpdatePrivateUserData} from '../authorization/permission/permissions/UpdatePrivateUserData.js'

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
            this.isValid(dto.name, dto.username, dto.dayStartTime, 'id' in dto ? dto.id : undefined)
    }

    fromDto(dto: UserDto): User {
        precondition(this.isDtoValid(dto))
        return this.recreate(new PersonName(dto.name), new Username(dto.username), new DayStartTime(dto.dayStartTime), new Identification(dto.id))
    }

    create(name: PersonName, username: Username) {
        return new this.userConstructor(name, username, new DayStartTime(), Identification.create())
    }

     recreate(name: PersonName, username: Username, dayStartTime: DayStartTime, id: Identification) {
        return new this.userConstructor(name, username, dayStartTime, id)
    }

    apply(user: User, data: Omit<Partial<UserDto>, 'id'>, permissions: UserPermissions) {
        UserPermissionsAuthorization.userWithPermissions(permissions).assertCan(UpdatePrivateUserData, user)
        const modifiedUser = { ...user.toDto(), ...data }
        if (!this.arePropertiesValid(modifiedUser)) {
            throw new InputDataNotValidError()
        }
        return new UserFactory().fromDto(modifiedUser)
    }

}
