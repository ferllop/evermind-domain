import { Id } from '../../domain/shared/value/Id.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserUnsubscribesFromCardRequest = WithRequesterRequest & {
    readonly userId: Id;
    readonly cardId: Id;
};
