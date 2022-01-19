import { Entity } from '../shared/Entity.js'
import { Identification } from '../shared/value/Identification.js'
import { Answer } from './Answer.js'
import { AuthorIdentification } from './AuthorIdentification.js'
import { CardDto } from './CardDto.js'
import { CardIdentification } from './CardIdentification.js'
import { CardMapper } from './CardMapper.js'
import { Labelling } from './Labelling.js'
import { Question } from './Question.js'
import { WrittenAnswer } from './WrittenAnswer.js'
import { WrittenQuestion } from './WrittenQuestion.js'

export class Card extends Entity {

    private readonly authorID: AuthorIdentification
    private readonly question: Question
    private readonly answer: Answer
    private readonly labelling: Labelling

    protected constructor(authorID: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, id: CardIdentification) {
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

    equals(card: Card) {
        return this.getId().equals(card.getId())
    }

    static create(userId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling){
        return new Card(userId, question, answer, labels, Identification.create())
    }

    static recreate(authorID: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, id: Identification){
        return new Card(authorID, question, answer, labels, id)
    }

    apply(card: Omit<Partial<CardDto>, 'id'>) {
        const modifiedCard = { ...this.toDto(), ...card}
        return new CardMapper().fromDto(modifiedCard)
    }

    static isValid(authorID: string, question: string, answer: string, labels: string[], id?: string) {
        return Identification.isValid(authorID) &&
            WrittenQuestion.isValid(question) &&
            WrittenAnswer.isValid(answer) &&
            Labelling.isValid(labels) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }

    toDto(){
        return {
            id: this.getId().getId(),
            authorID: this.getAuthorID().getId(),
            question: this.getQuestion().getValue() as string,
            answer: this.getAnswer().getValue() as string,
            labelling: this.getLabelling().getLabels().map(label => label.toString())
        }
    }

    static fromDto(dto: CardDto){
        return new CardMapper().fromDto(dto)
    }

}
