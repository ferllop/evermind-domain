import {User} from './User.js'
import {Validator} from '../shared/Validator.js'
import {DayStartTime} from '../shared/value/DayStartTime.js'
import {Identification} from '../shared/value/Identification.js'
import {MayBeIdentified} from '../shared/value/MayBeIdentified.js'
import {PersonName} from './PersonName.js'
import {UserDto} from 'evermind-types'
import {UserIdentification} from './UserIdentification.js'
import {Username} from './Username.js'
import {precondition} from '../../implementations/preconditions.js'
import {EntityFactory} from '../shared/EntityFactory.js'
import {InputDataNotValidError} from '../errors/InputDataNotValidError.js'
import {UserAuthorization} from '../authorization/permission/UserAuthorization.js'
import {UserPermissions} from '../authorization/permission/UserPermissions.js'
import {UpdatePrivateUserData} from '../authorization/permission/permissions/UpdatePrivateUserData.js'
import {StoredUser} from './StoredUser.js'

export class UserFactory extends EntityFactory<User, UserDto> {

    private userConstructor = User.prototype.constructor as { new(name: PersonName, username: Username, dayStartTime: DayStartTime): User}

    constructor() {
        super()
    }

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
            this.isValid(
                dto.name,
                dto.username,
                dto.dayStartTime,
                'id' in dto ? dto.id : undefined)
    }

    fromDto(dto: UserDto): StoredUser {
        precondition(this.isDtoValid(dto))
        return this.recreate(
            new PersonName(dto.name),
            new Username(dto.username),
            new DayStartTime(dto.dayStartTime),
            new Identification(dto.id))
    }

    create(name: PersonName, username: Username) {
        return new this.userConstructor(name, username, new DayStartTime())
    }

    recreate(name: PersonName, username: Username, dayStartTime: DayStartTime, id: Identification): StoredUser {
        const user = new this.userConstructor(name, username, dayStartTime)
        return new StoredUser(user, id)
    }

    apply(user: StoredUser, data: Omit<Partial<UserDto>, 'id'>, permissions: UserPermissions) {
        UserAuthorization.userWithPermissions(permissions).assertCan(UpdatePrivateUserData, user)
        const modifiedUser = { ...user.toDto(), ...data }
        if (!this.arePropertiesValid(modifiedUser)) {
            throw new InputDataNotValidError()
        }
        return this.fromDto(modifiedUser)
    }
}
