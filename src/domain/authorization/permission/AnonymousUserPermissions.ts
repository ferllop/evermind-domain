import {RequesterIdentification} from './RequesterIdentification.js'
import {UserPermissions} from './UserPermissions.js'

export class AnonymousUserPermissions extends UserPermissions {
    constructor() {
        super(RequesterIdentification.NULL, [])
    }
}