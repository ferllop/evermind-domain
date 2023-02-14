import {WithRequesterRequest} from './WithRequesterRequest.js'
import {Id} from '../../domain/shared/value/Id.js'

export type UserTransfersCardRequest = WithRequesterRequest & {
    cardId: Id,
    authorId: Id,
}