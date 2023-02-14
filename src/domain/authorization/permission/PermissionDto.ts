import {Id} from 'evermind-types'
import {PermissionValue} from './PermissionValue.js'

export type PermissionDto = {
    userId: Id,
    value: PermissionValue,
}