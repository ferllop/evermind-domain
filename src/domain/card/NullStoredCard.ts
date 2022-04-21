import {AuthorIdentification} from './AuthorIdentification.js'
import {NullQuestion} from './NullQuestion.js'
import {NullAnswer} from './NullAnswer.js'
import {Labelling} from './Labelling.js'
import {CardIdentification} from './CardIdentification.js'
import {CardNotFoundError} from '../errors/CardNotFoundError.js'
import {Card} from './Card.js'

class NullStoredCard extends Card {
    private static instance: NullStoredCard | null = null

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
        if (this.instance === null) {
            this.instance = new NullStoredCard()
        }
        return this.instance
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

export const NullCardInstance = NullStoredCard.getInstance()