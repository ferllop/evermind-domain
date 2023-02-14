import { Query } from '../types/Query.js'
import {RequesterDto} from '../dtos/RequesterDto.js'

export type UserSearchesForCardsRequest = Query & Partial<RequesterDto>;
