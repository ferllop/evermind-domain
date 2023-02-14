import { IdDto } from '../dtos/IdDto.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserRemovesCardRequest = WithRequesterRequest & IdDto
