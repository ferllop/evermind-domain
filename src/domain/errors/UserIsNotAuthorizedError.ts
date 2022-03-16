import {PermissionValue} from '../authorization/permission/PermissionValue.js'
import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class UserIsNotAuthorizedError extends DomainError {
    constructor(permissions: PermissionValue[]) {
        super(DomainErrorCode.USER_IS_NOT_AUTHORIZED,
            'User don\'t have the required permissions: ' + permissions.join(', '))
    }
}