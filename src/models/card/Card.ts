import { precondition } from '../../lib/preconditions.js'
import { Identification } from '../value/Identification.js'
import { Answer } from './Answer.js'
import { Labelling } from './Labelling.js'
import { Question } from './Question.js'
import { WrittenAnswer } from './WrittenAnswer.js'
import { WrittenQuestion } from './WrittenQuestion.js'

export class Card {
    private id: Identification
    private authorID: Identification
    private question: Question
    private answer: Answer
    private labelling: Labelling

    constructor(authorID: string, question: string, answer: string, labels: string[], id?: string) {
        precondition(Card.isValid(authorID, question, answer, labels))
        this.authorID = new Identification(authorID)
        this.question = new WrittenQuestion(question)
        this.answer = new WrittenAnswer(answer)
        this.labelling = new Labelling(labels)
        this.id = id ? new Identification(id) : new Identification()
    }

    clone(): Card {
        return new Card(
            this.getAuthorID().toString(),
            this.getQuestion().getQuestion(),
            this.getAnswer().getAnswer(),
            this.getLabelling().getLabels()
        )
    }

    getAuthorID(): Identification {
        return this.authorID
    }

    getQuestion(): Question {
        return this.question
    }

    getAnswer(): Answer {
        return this.answer
    }

    getLabelling(): Labelling {
        return this.labelling
    }

    getId(): Identification {
        return this.id
    }

    hasSameAuthor(card: Card) {
        return this.authorID === card.authorID
    }

    hasAuthorId(authorId: string) {
        return this.authorID.equals(authorId)
    }

    static isValid(authorID: string, question: string, answer: string, labels: string[], id?: string) {
        return Identification.isValid(authorID) &&
            WrittenQuestion.isValid(question) &&
            WrittenAnswer.isValid(answer) &&
            Labelling.areValid(labels) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }


}