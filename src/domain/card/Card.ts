import {Entity} from '../shared/Entity.js'
import {Identification} from '../shared/value/Identification.js'
import {Answer} from './Answer.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {CardIdentification} from './CardIdentification.js'
import {Labelling} from './Labelling.js'
import {Question} from './Question.js'
import {CardDto} from '../../types/dtos/CardDto.js'
import {Visibility} from './Visibility.js'
import {StoredUser} from '../user/StoredUser.js'

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
            new AuthorIdentification(this.authorId.getValue()),
            this.question.clone(),
            this.answer.clone(),
            this.labelling.clone(),
            this.visibility,
            Identification.create()
        )
    }

    isPublic() {
        return this.visibility === 'PUBLIC'
    }

    hasAuthorId(authorId: AuthorIdentification) {
        return this.authorId.equals(authorId)
    }

    equals(card: Card) {
        return this.getId().equals(card.getId())
    }

    transferTo(user: StoredUser) {
        return new Card(
            user.getId(),
            this.question.clone(),
            this.answer.clone(),
            this.labelling.clone(),
            this.visibility,
            this.getId()
        )
    }

    toDto(): CardDto{
        return {
            id: this.getId().getValue(),
            authorId: this.authorId.getValue(),
            question: this.question.getValue() as string,
            answer: this.answer.getValue() as string,
            labelling: this.labelling.getValue(),
            visibility: this.visibility,
        }
    }
}
