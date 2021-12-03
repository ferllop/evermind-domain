import { CardDto } from '../domain/card/CardDto.js';
import { Id } from '../domain/value/Id.js';
import { OnlyRequired } from '../domain/value/OnlyRequired.js';

export type UserModifiesCardDataRequest = OnlyRequired<CardDto, 'id'> & {userId: Id};
