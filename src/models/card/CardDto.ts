import { Identified } from '../../storage/datastores/Identified';

export type CardDto = Identified & {
    authorID: string,
    question: string,
    answer: string,
    labelling: string[]
}
