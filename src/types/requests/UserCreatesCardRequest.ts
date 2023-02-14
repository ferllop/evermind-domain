import {WithRequesterRequest} from './WithRequesterRequest.js'
import {CardDto} from '../dtos/CardDto.js'
import {Unidentified} from '../types/Unidentified.js'

export type UserCreatesCardRequest = WithRequesterRequest & Unidentified<CardDto>
