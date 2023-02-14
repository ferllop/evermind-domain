import {Id} from '../types/Id.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserGetsUserSubscriptionsRequest = WithRequesterRequest & {
    userId: Id,
}