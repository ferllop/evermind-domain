import {RequesterIdentification} from './permission/RequesterIdentification.js'
import {UserIsNotAuthorizedError} from '../errors/UserIsNotAuthorizedError.js'
import {PermissionValidator} from './permission/AsyncPermissionValidator.js'

export class Authorization {
    static assert(requesterId: RequesterIdentification) {
        return new Authorization(requesterId)
    }

    constructor(private requesterId: RequesterIdentification) {
    }

    async can(Permission: (new (requesterId: RequesterIdentification) => PermissionValidator), obj: unknown) {
        const permission = new Permission(this.requesterId)
        const missingPermissions = await permission.validate(obj)
        if (missingPermissions.length > 0) {
            throw new UserIsNotAuthorizedError(missingPermissions)
        }
    }

}