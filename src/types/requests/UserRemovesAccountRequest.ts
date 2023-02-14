import {RequesterDto} from '../dtos/RequesterDto.js'
import {Id} from '../../domain/shared/value/Id.js'

export type UserRemovesAccountRequest = RequesterDto & {userId: Id}
