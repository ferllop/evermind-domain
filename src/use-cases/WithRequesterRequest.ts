import {Request} from './Request.js'
import {Id} from '../domain/shared/value/Id.js'

export type WithRequesterRequest = Request & { requesterId: Id};