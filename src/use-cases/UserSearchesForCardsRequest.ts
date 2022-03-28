import { Query } from '../domain/search/Query.js'
import {RequesterDto} from './RequesterDto.js'

export type UserSearchesForCardsRequest = Query & Partial<RequesterDto>;
