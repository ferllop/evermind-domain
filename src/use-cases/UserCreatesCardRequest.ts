import { Id } from '../domain/shared/value/Id';

export type UserCreatesCardRequest = {
    userId: Id,
    question: string,
    answer: string,
    labelling: string[]
}
