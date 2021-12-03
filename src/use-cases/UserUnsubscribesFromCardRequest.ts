import { Id } from '../domain/shared/value/Id';

export type UserUnsubscribesFromCardRequest = {
    readonly userId: Id;
    readonly cardId: Id;
};
