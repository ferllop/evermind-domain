import {Unidentified} from '../../../types/types/Unidentified.js'

export type MayBeIdentified<T> = Unidentified<T> | T;
