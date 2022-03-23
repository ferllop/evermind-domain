import {PermissionValue} from './PermissionValue.js'

export interface PermissionValidator {
    validate(...obj: unknown[]): Promise<PermissionValue[]>
}