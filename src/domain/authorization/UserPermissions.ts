import {UserIdentification} from '../user/UserIdentification.js'
import {PermissionValue} from './permission/PermissionValue.js'

export class UserPermissions {

    constructor(private userId: UserIdentification, private permissions: PermissionValue[]) {
    }

    getUserId() {
        return this.userId
    }

    has(permissionAskingFor: PermissionValue) {
        return this.permissions.some(permission => permission === permissionAskingFor)
    }
}