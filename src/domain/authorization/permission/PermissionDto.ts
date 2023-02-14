import {Id} from '../../../types/types/Id.js'
import {PermissionValue} from './PermissionValue.js'

export type PermissionDto = {
    userId: Id,
    value: PermissionValue,
}