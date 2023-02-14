import { Query } from '../domain/search/Query.js'
import {RequesterDto} from '../types/dtos/RequesterDto.js'

export type UserSearchesForCardsRequest = Query & Partial<RequesterDto>;
