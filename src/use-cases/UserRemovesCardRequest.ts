import { IdDto } from '../domain/shared/value/IdDto.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserRemovesCardRequest = WithRequesterRequest & IdDto
