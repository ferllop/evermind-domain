import {Username} from './Username.js'
import {Authorization} from '../authorization/Authorization.js'
import {CreateUserAccount} from '../authorization/permission/permissions/CreateUserAccount.js'
import {Email} from './Email.js'
import {UserAccount} from '../authorization/UserAccount.js'
import {Password} from '../authorization/Password.js'

export class CreateUserAccountCommand {

    constructor(private authorization: Authorization) {
    }

    async create(username: Username, email: Email, password: Password) {
        this.authorization.assertCan(CreateUserAccount)
        return new UserAccount(username, email, password)
    }
}