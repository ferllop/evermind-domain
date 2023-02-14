import {Unidentified} from 'evermind-types'

export type MayBeIdentified<T> = Unidentified<T> | T;
