import {Id} from '../domain/shared/value/Id.js'
import {RequesterDto} from './RequesterDto.js'

export type UserGetsUserInfoRequest = {userId: Id} & RequesterDto
