import {PermissionValidator} from '../PermissionValidator.js'
import {PermissionValue} from '../PermissionValue.js'
import {UserPermissions} from '../../UserPermissions.js'
import {UserIdentification} from '../../../user/UserIdentification.js'

export class GetDataFromOtherUser implements PermissionValidator<UserIdentification> {
    constructor(private userPermissions: UserPermissions) {
    }

    validate(user: UserIdentification) {
        if (this.userPermissions.areFromUser(user)) {
            return []
        }
        const permissionToCheck: PermissionValue = 'GET_DATA_FROM_OTHER_USER'
        return this.userPermissions.has(permissionToCheck) ? [] : [permissionToCheck]
    }
}

