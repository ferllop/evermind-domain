import {UserPermissions} from './UserPermissions.js'
import {RequesterIdentification} from './RequesterIdentification.js'
import {UserAuthorization} from './UserAuthorization.js'

export class AnonymousUserAuthorization extends UserAuthorization {
    constructor() {
        super(new UserPermissions(RequesterIdentification.NULL, ['CREATE_OWN_USER_ACCOUNT']))
    }
}