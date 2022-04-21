import {UserIdentification} from '../../user/UserIdentification.js'
import {PermissionValue} from './PermissionValue.js'
import {User} from '../../user/User.js'
import {StoredUser} from '../../user/StoredUser.js'

export class UserPermissions {

    constructor(private userId: UserIdentification, private permissions: PermissionValue[]) {
    }

    isUserAnonymous() {
        return this.getUserId().isNull()
    }

    getUserId() {
        return this.userId
    }

    areFromUser(user: StoredUser | UserIdentification): boolean {
        return user instanceof User
            ? user.getId().equals(this.userId)
            : user.equals(this.userId)
    }

    has(permissionAskingFor: PermissionValue) {
        return this.permissions.some(permission => permission === permissionAskingFor)
    }
}

