import { Id } from '../domain/value/Id';

export type UserCreatesCardRequest = {
    userId: Id,
    question: string,
    answer: string,
    labelling: string[]
}
