import {CardDto} from '../types/dtos/CardDto.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserModifiesCardDataRequest = WithRequesterRequest & CardDto
