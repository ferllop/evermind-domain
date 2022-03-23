import {Id} from '../domain/shared/value/Id.js'
import {WithRequesterRequest} from './WithRequesterRequest.js'

export type UserCreatesCardRequest = WithRequesterRequest & {
    authorId: Id,
    question: string,
    answer: string,
    labelling: string[]
}
