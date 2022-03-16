import {PermissionValue} from '../authorization/permission/PermissionValue.js'

export interface AsyncPermissionValidator {
    validate(obj: unknown): Promise<PermissionValue[]>
}