import {UserDto} from '../domain/user/UserDto.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserModifiesUserDataRequest = WithRequesterRequest & UserDto


