import {WithRequesterRequest} from './WithRequesterRequest.js'
import {CardDto} from '../domain/card/CardDto.js'
import {Unidentified} from '../domain/shared/value/Unidentified.js'

export type UserCreatesCardRequest = WithRequesterRequest & Unidentified<CardDto>
