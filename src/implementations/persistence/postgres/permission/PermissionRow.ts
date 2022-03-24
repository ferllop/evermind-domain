import {PermissionValue} from '../../../../domain/authorization/permission/PermissionValue.js'

export type PermissionRow = {
    user_id: string,
    value: PermissionValue,
}