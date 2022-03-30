import {AuthorIdentification} from './AuthorIdentification.js'
import {CardIdentification} from './CardIdentification.js'
import {Labelling} from './Labelling.js'
import {NullQuestion} from './NullQuestion.js'
import {NullAnswer} from './NullAnswer.js'
import {Card} from './Card.js'
import {CardNotFoundError} from '../errors/CardNotFoundError.js'

export class NullCard extends Card {
    private static instance = null

    private constructor() {
        super(
            AuthorIdentification.NULL,
            new NullQuestion(),
            new NullAnswer(),
            Labelling.NULL,
            'PUBLIC',
            CardIdentification.NULL,
        )
    }

    static getInstance() {
        return this.instance ?? new NullCard()
    }

    override toDto() {
        if (this.isNull()) {
            throw new CardNotFoundError()
        }
        return super.toDto()
    }

    override hasAuthorId(id: AuthorIdentification) {
        if (this.isNull()) {
            throw new CardNotFoundError()
        }
        return super.hasAuthorId(id)
    }

    override getId() {
        if (this.isNull()) {
            throw new CardNotFoundError()
        }
        return super.getId()
    }

    override isNull() {
        return true
    }
}
