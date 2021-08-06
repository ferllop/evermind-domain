import { precondition } from '../../lib/preconditions.js'
import { Entity } from '../Entity.js'
import { Identification } from '../value/Identification.js'
import { Answer } from './Answer.js'
import { Labelling } from './Labelling.js'
import { Question } from './Question.js'
import { WrittenAnswer } from './WrittenAnswer.js'
import { WrittenQuestion } from './WrittenQuestion.js'

export class Card extends Entity {
    private authorID: Identification
    private question: Question
    private answer: Answer
    private labelling: Labelling

    constructor(authorID: string, question: string, answer: string, labels: string[], id: Identification) {
        super(id)
        precondition(Card.isValid(authorID, question, answer, labels))
        this.authorID = new Identification(authorID)
        this.question = new WrittenQuestion(question)
        this.answer = new WrittenAnswer(answer)
        this.labelling = new Labelling(labels)
    }

    clone(): Card {
        return new Card(
            this.getAuthorID().toString(),
            this.getQuestion().getQuestion() as string,
            this.getAnswer().getAnswer() as string,
            this.getLabelling().getLabels(),
            Identification.create()
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
