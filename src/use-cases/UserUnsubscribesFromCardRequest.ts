import { Id } from '../models/value/Id';

export type UserUnsubscribesFromCardRequest = {
    readonly userId: Id;
    readonly cardId: Id;
};
