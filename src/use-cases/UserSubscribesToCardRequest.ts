import { Id } from '../domain/value/Id';

export type UserSubscribesToCardRequest = {
    readonly userId: Id;
    readonly cardId: Id;
};
