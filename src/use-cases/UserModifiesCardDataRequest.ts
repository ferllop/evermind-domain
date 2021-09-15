import { CardDto } from '../models/card/CardDto.js';
import { Id } from '../models/value/Id.js';
import { OnlyRequired } from '../models/value/OnlyRequired.js';

export type UserModifiesCardDataRequest = OnlyRequired<CardDto, 'id'> & {userId: Id};
