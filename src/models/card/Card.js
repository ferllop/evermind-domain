import { precondition } from '../../lib/preconditions.js'
import { Identification } from '../value/Identification.js'
import { Answer } from './Answer.js'
import { Labelling } from './Labelling.js'
import { Question } from './Question.js'
import { WrittenAnswer } from './WrittenAnswer.js'
import { WrittenQuestion } from './WrittenQuestion.js'

export class Card {
    /** @type {Identification} */
    #id

    /**@type {Identification} */
    #authorID

    /**@type {Question} */
    #question

    /**@type {Answer} */
    #answer

    /**@type {Labelling} */
    #labelling

    /**
     * @param {string} authorID 
     * @param {string} question 
     * @param {string} answer 
     * @param {string[]} labels 
     * @param {string} [id]
     */
    constructor(authorID, question, answer, labels, id) {
        precondition(Card.isValid(authorID, question, answer, labels))
        this.#authorID = new Identification(authorID)
        this.#question = new WrittenQuestion(question)
        this.#answer = new WrittenAnswer(answer)
        this.#labelling = new Labelling(labels)
        this.#id = id ? new Identification(id) : new Identification()
    }

    /**@returns {Card} */
    clone() {
        return new Card(
            this.getAuthorID().toString(),
            this.getQuestion().getQuestion(),
            this.getAnswer().getAnswer(),
            this.getLabelling().getLabels()
        )
    }

    /**@returns {Identification} */
    getAuthorID() {
        return this.#authorID
    }

    /**@returns {Question} */
    getQuestion() {
        return this.#question
    }

    /**@returns {Answer} */
    getAnswer() {
        return this.#answer
    }

    /**@returns {Labelling} */
    getLabelling() {
        return this.#labelling
    }

    /**@returns {Identification} */
    getId() {
        return this.#id
    }

    /**
     * @param {string} authorID 
     * @param {string} question 
     * @param {string} answer 
     * @param {string[]} labels 
     * @param {string} [id] 
     * @returns {boolean}
     */
    static isValid(authorID, question, answer, labels, id) {
        return Identification.isValid(authorID) &&
            WrittenQuestion.isValid(question) &&
            WrittenAnswer.isValid(answer) &&
            Labelling.areValid(labels) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }


}
