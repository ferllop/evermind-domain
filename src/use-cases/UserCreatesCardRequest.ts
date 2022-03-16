import { Id } from '../domain/shared/value/Id.js'
import {Request} from './Request.js'

export type UserCreatesCardRequest = Request & {
    authorId: Id,
    question: string,
    answer: string,
    labelling: string[]
}
