import {AuthorIdentification} from './AuthorIdentification.js'
import {Labelling} from './Labelling.js'
import {CardIdentification} from './CardIdentification.js'
import {CardDto} from 'evermind-types'
import {Card} from './Card.js'
import {WrittenQuestion} from './WrittenQuestion.js'
import {WrittenAnswer} from './WrittenAnswer.js'

export class StoredCard extends Card {
    constructor(card: Card) {
        const {authorId, question, answer, labelling, visibility, id} = card.toDto()
        super(
            new AuthorIdentification(authorId),
            new WrittenQuestion(question),
            new WrittenAnswer(answer),
            Labelling.fromStringLabels(labelling),
            visibility,
            CardIdentification.recreate(id))
    }

    override getId() {
        return super.getId()
    }

    override toDto(): CardDto {
        return {
            ...super.toDto(),
            id: this.getId().getValue(),
        }
    }

    override isNull() {
        return false
    }

}