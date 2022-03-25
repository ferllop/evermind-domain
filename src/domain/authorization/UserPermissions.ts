import {UserIdentification} from '../user/UserIdentification.js'
import {PermissionValue} from './permission/PermissionValue.js'
import {User} from '../user/User.js'

export class UserPermissions {

    constructor(private userId: UserIdentification, private permissions: PermissionValue[]) {
    }

    getUserId() {
        return this.userId
    }

    areFromUser(user: UserIdentification): boolean
    areFromUser(user: User | UserIdentification): boolean {
        return user instanceof User
            ? user.getId().equals(this.userId)
            : user.equals(this.userId)
    }

    has(permissionAskingFor: PermissionValue) {
        return this.permissions.some(permission => permission === permissionAskingFor)
    }
}