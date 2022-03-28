import {UserPermissions} from '../authorization/permission/UserPermissions.js'
import {EntityFactory} from './EntityFactory.js'

export abstract class WithAuthorizationEntityFactory<T, TDto> extends EntityFactory<T, TDto> {
    constructor(protected permissions: UserPermissions) {
        super()
    }
}
