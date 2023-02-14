import {Id} from '../../domain/shared/value/Id.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserGetsUserSubscriptionsRequest = WithRequesterRequest & {
    userId: Id,
}