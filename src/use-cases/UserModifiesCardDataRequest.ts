import { CardDto } from '../domain/card/CardDto.js';
import { Id } from '../domain/shared/value/Id.js';
import { OnlyRequired } from '../domain/shared/value/OnlyRequired.js';

export type UserModifiesCardDataRequest = OnlyRequired<CardDto, 'id'> & {userId: Id};
