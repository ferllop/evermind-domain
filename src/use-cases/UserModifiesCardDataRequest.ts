import { OnlyRequired } from '../helpers/OnlyRequired.js';
import { CardDto } from '../models/card/CardDto.js';
import { Id } from '../models/value/Id.js';

export type UserModifiesCardDataRequest = OnlyRequired<CardDto, 'id'> & {userId: Id};
