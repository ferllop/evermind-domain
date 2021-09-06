import { Id } from '../models/value/Id';

export type UserSubscribesToCardRequest = {
    readonly userId: Id;
    readonly cardId: Id;
};
