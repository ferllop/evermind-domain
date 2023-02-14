import {WithRequesterRequest} from './WithRequesterRequest.js'
import {Id} from '../types/Id.js'

export type UserReadsACardRequest = WithRequesterRequest & {
    cardId: Id,
}
