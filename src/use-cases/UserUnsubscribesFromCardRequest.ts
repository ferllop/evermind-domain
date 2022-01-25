import { Id } from '../domain/shared/value/Id.js'

export type UserUnsubscribesFromCardRequest = {
    readonly userId: Id;
    readonly cardId: Id;
};
