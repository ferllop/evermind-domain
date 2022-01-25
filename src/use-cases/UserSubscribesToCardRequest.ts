import { Id } from '../domain/shared/value/Id.js'

export type UserSubscribesToCardRequest = {
    readonly userId: Id;
    readonly cardId: Id;
};
