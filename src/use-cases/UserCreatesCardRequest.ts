import { Id } from '../domain/shared/value/Id.js'

export type UserCreatesCardRequest = {
    userId: Id,
    question: string,
    answer: string,
    labelling: string[]
}
