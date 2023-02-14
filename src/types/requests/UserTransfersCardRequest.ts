import {WithRequesterRequest} from './WithRequesterRequest.js'
import {Id} from '../types/Id.js'

export type UserTransfersCardRequest = WithRequesterRequest & {
    cardId: Id,
    authorId: Id,
}