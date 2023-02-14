import { Query } from '../../domain/search/Query.js'
import {RequesterDto} from '../dtos/RequesterDto.js'

export type UserSearchesForCardsRequest = Query & Partial<RequesterDto>;
