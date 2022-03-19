import {Unidentified} from './Unidentified.js'

export type MayBeIdentified<T> = Unidentified<T> | T;
