import { precondition } from '../../lib/preconditions.js'
import { Answer } from './Answer.js'
import { Labelling } from './Labelling.js'
import { Question } from './Question.js'
import { WrittenAnswer } from './WrittenAnswer.js'
import { WrittenQuestion } from './WrittenQuestion.js'

export class Card {

    /**@type {string} */
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
     */
    constructor(authorID, question, answer, labels) {
        precondition(Card.isValid(authorID, question, answer, labels))
        this.#authorID = authorID
        this.#question = new WrittenQuestion(question)
        this.#answer = new WrittenAnswer(answer)
        this.#labelling = new Labelling(labels)
    }

    /**@returns {Card} */
    clone() {
        return new Card(
            this.getAuthorID(),
            this.getQuestion().getQuestion(),
            this.getAnswer().getAnswer(),
            this.getLabelling().getLabels()
        )
    }

    /**@returns {string} */
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

    /**
     * @param {string} authorID 
     * @param {string} question 
     * @param {string} answer 
     * @param {string[]} labels 
     * @returns {boolean}
     */
    static isValid(authorID, question, answer, labels) {
        return Boolean(authorID) &&
            WrittenQuestion.isValid(question) &&
            WrittenAnswer.isValid(answer) &&
            Labelling.areValid(labels)
    }

}
