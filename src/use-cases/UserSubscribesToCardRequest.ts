import { Id } from '../domain/shared/value/Id';

export type UserSubscribesToCardRequest = {
    readonly userId: Id;
    readonly cardId: Id;
};
