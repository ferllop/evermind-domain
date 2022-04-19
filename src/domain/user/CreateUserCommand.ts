import {User} from './User.js'
import {PersonName} from './PersonName.js'
import {Username} from './Username.js'
import {DayStartTime} from '../shared/value/DayStartTime.js'
import {UserIdentification} from './UserIdentification.js'
import {Authorization} from '../authorization/Authorization.js'
import {UserRepository} from './UserRepository.js'
import {UserAlreadyExistsError} from '../errors/UserAlreadyExistsError.js'
import {Identification} from '../shared/value/Identification.js'
import {CreateUserAccount} from '../authorization/permission/permissions/CreateUserAccount.js'
import {Email} from './Email.js'

export class CreateUserCommand {
    private userConstructor = User.prototype.constructor as { new(name: PersonName, username: Username, email: Email, dayStartTime: DayStartTime, id: UserIdentification): User }

    constructor(private authorization: Authorization) {
    }

    async create(name: PersonName, username: Username, email: Email) {
        if (await new UserRepository().hasUsername(username)) {
            throw new UserAlreadyExistsError()
        }
        const user = new this.userConstructor(name, username, email, new DayStartTime(), Identification.create())
        this.authorization.assertCan(CreateUserAccount, user)
        return user
    }
}