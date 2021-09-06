import { OnlyRequired } from '../helpers/OnlyRequired.js';
import { CardDto } from '../models/card/CardDto.js';

export type UserModifiesCardDataRequest = OnlyRequired<CardDto, 'id' | 'answer'>;
