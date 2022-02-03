import {Entity} from '../shared/Entity.js'
import {Identification} from '../shared/value/Identification.js'
import {Answer} from './Answer.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {CardIdentification} from './CardIdentification.js'
import {Labelling} from './Labelling.js'
import {Question} from './Question.js'

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
            new AuthorIdentification(this.getAuthorID().getId()),
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

    toDto(){
        return {
            id: this.getId().getId(),
            authorID: this.getAuthorID().getId(),
            question: this.getQuestion().getValue() as string,
            answer: this.getAnswer().getValue() as string,
            labelling: this.getLabelling().getLabels().map(label => label.toString())
        }
    }
}
