import {NewablePermission} from './permission/NewablePermission.js'

export interface Authorization {
    can<T>(Permission: NewablePermission<T>, ...obj: T[]): boolean
    assertCan<T>(Permission: NewablePermission<T>, ...obj: T[]): void
}