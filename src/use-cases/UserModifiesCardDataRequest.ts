import {CardDto} from '../domain/card/CardDto.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserModifiesCardDataRequest = WithRequesterRequest & CardDto
