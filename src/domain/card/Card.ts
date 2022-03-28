import {Entity} from '../shared/Entity.js'
import {Identification} from '../shared/value/Identification.js'
import {Answer} from './Answer.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {CardIdentification} from './CardIdentification.js'
import {Labelling} from './Labelling.js'
import {Question} from './Question.js'
import {CardDto} from './CardDto.js'

export type Visibility = 'PUBLIC' | 'PRIVATE'

export class Card extends Entity {

    private readonly authorId: AuthorIdentification
    private readonly question: Question
    private readonly answer: Answer
    private readonly labelling: Labelling
    private readonly visibility: Visibility

    protected constructor(authorId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, visibility: Visibility, id: CardIdentification) {
        super(id)
        this.authorId = authorId
        this.question = question
        this.answer = answer
        this.labelling = labels
        this.visibility = visibility
    }

    clone(): Card {
        return new Card(
            new AuthorIdentification(this.getAuthorId().getId()),
            this.getQuestion().clone(),
            this.getAnswer().clone(),
            this.getLabelling().clone(),
            this.getVisibility(),
            Identification.create()
        )
    }

    getAuthorId(): AuthorIdentification {
        return this.authorId
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

    getVisibility() {
        return this.visibility
    }

    hasAuthorId(authorId: AuthorIdentification) {
        return this.authorId.equals(authorId)
    }

    equals(card: Card) {
        return this.getId().equals(card.getId())
    }

    toDto(): CardDto{
        return {
            id: this.getId().getId(),
            authorId: this.getAuthorId().getId(),
            question: this.getQuestion().getValue() as string,
            answer: this.getAnswer().getValue() as string,
            labelling: this.getLabelling().getLabels().map(label => label.toString()),
            visibility: this.getVisibility(),
        }
    }
}
