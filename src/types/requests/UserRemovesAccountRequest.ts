import {RequesterDto} from '../dtos/RequesterDto.js'
import {Id} from '../types/Id.js'

export type UserRemovesAccountRequest = RequesterDto & {userId: Id}
