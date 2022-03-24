import {PermissionValue} from './PermissionValue.js'

export interface PermissionValidator<T> {
    validate(...obj: T[]): PermissionValue[]
}