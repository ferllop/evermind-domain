import {UserIdentification} from '../../user/UserIdentification.js'
import {precondition} from '../../../implementations/preconditions.js'
import {PermissionValue} from './PermissionValue.js'
import {PermissionDto} from './PermissionDto.js'
import {AsyncPermissionValidator} from '../../shared/AsyncPermissionValidator.js'

export abstract class Permission implements AsyncPermissionValidator {
    constructor(private userId: UserIdentification, private value: PermissionValue) {
    }

    getUserId() {
        return this.userId
    }

    getValue() {
        precondition(this.value !== null)
        return this.value
    }

    equals(permission: Permission) {
        return this.userId.equals(permission.userId) &&
            this.value === permission.value
    }

    toDto(): PermissionDto {
        return {
            userId: this.getUserId().getId(),
            permission: this.getValue()!,
        }
    }

    abstract validate(obj: unknown): Promise<PermissionValue[]>

}


