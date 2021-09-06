import { Entity } from '../Entity.js'
import { Identification } from '../value/Identification.js'
import { Answer } from './Answer.js'
import { AuthorIdentification } from './AuthorIdentification.js'
import { CardIdentification } from './CardIdentification.js'
import { Labelling } from './Labelling.js'
import { Question } from './Question.js'
import { WrittenAnswer } from './WrittenAnswer.js'
import { WrittenQuestion } from './WrittenQuestion.js'

export class Card extends Entity {
    private authorID: AuthorIdentification
    private question: Question
    private answer: Answer
    private labelling: Labelling

    private constructor(authorID: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, id: CardIdentification) {
        super(id)
        this.authorID = authorID
        this.question = question
        this.answer = answer
        this.labelling = labels
    }

    clone(): Card {
        return new Card(
            this.getAuthorID().clone(),
            this.getQuestion().clone(),
            this.getAnswer().clone(),
            this.getLabelling().clone(),
            Identification.create()
        )
    }

    getAuthorID(): AuthorIdentification {
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

    hasAuthorId(authorId: AuthorIdentification) {
        return this.authorID.equals(authorId)
    }

    static create(userId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling){
        return new Card(userId, question, answer, labels, Identification.create())
    }

    static recreate(authorID: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, id: Identification){
        return new Card(authorID, question, answer, labels, id)
    }

    static isValid(authorID: string, question: string, answer: string, labels: string[], id?: string) {
        return Identification.isValid(authorID) &&
            WrittenQuestion.isValid(question) &&
            WrittenAnswer.isValid(answer) &&
            Labelling.areValid(labels) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }


}
