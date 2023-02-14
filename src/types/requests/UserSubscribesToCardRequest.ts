import { Id } from '../types/Id.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserSubscribesToCardRequest = WithRequesterRequest & {
    readonly userId: Id
    readonly cardId: Id
}
