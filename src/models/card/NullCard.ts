import { AuthorIdentification } from './AuthorIdentification.js';
import { CardIdentification } from './CardIdentification.js';
import { Labelling } from './Labelling.js';
import { NullQuestion } from "./NullQuestion.js";
import { NullAnswer } from './NullAnswer.js';
import { Card } from './Card.js';

export class NullCard extends Card {
    private static instance = null

    private constructor() {
        super(
            new AuthorIdentification(''),
            new NullQuestion(),
            new NullAnswer(),
            Labelling.NULL,
            CardIdentification.NULL
        )
    }

    static getInstance() {
        return this.instance ?? new NullCard()
    }

    override isNull() {
        return true
    }
}