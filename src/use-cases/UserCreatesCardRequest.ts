import { Id } from '../models/value/Id';

export type UserCreatesCardRequest = {
    userId: Id,
    question: string,
    answer: string,
    labelling: string[]
}
