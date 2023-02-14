import {WithRequesterRequest} from './WithRequesterRequest.js'
import {CardDto} from '../types/dtos/CardDto.js'
import {Unidentified} from '../domain/shared/value/Unidentified.js'

export type UserCreatesCardRequest = WithRequesterRequest & Unidentified<CardDto>
