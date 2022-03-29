import {NewablePermission} from './permission/UserAuthorization.js'

export interface Authorization {
    can<T>(Permission: NewablePermission<T>, ...obj: T[]): boolean
    assertCan<T>(Permission: NewablePermission<T>, ...obj: T[]): void
}