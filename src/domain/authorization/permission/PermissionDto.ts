import {Id} from '../../shared/value/Id.js'
import {PermissionValue} from './PermissionValue.js'

export type PermissionDto = {
    userId: Id,
    value: PermissionValue,
}