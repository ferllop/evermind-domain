import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../UserPermissions.js'
import {User} from '../../../user/User.js'
import {precondition} from '../../../../implementations/preconditions.js'

export class CreateUserAccount implements PermissionValidator<User> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(user: User) {
        precondition(!user.getId().equals(this.userPermissions.getUserId()))
        const permissionToCheck: PermissionValue = this.userPermissions.isUserAnonymous()
            ? 'CREATE_OWN_USER_ACCOUNT'
            : 'CREATE_ACCOUNT_FOR_OTHER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}

