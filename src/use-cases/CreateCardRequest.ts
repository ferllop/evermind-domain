import { CardDto } from '../models/card/CardDto.js';

export type CreateCardRequest = Omit<CardDto, 'id'>;
