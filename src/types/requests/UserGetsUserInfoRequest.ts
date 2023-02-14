import {Id} from '../types/Id.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserGetsUserInfoRequest = WithRequesterRequest & {
    userId: Id,
}
