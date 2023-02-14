import {Id} from '../../domain/shared/value/Id.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserGetsUserInfoRequest = WithRequesterRequest & {
    userId: Id,
}
