import { IdDto } from '../../models/value/IdDto';
import { Unidentified } from './Unidentified';

export type Identified<T> = (IdDto & T) | (IdDto & Unidentified<T>)

