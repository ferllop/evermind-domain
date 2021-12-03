import { Id } from '../domain/value/Id';

export type UserUnsubscribesFromCardRequest = {
    readonly userId: Id;
    readonly cardId: Id;
};
