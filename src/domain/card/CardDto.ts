import {Visibility} from './Card.js'

export type CardDto = {
    id: string,
    authorId: string,
    question: string,
    answer: string,
    labelling: string[],
    visibility: Visibility,
}
