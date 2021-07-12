import { Answer } from './Answer.js'
import { Labelling } from './Labelling.js'
import { Question } from './Question.js'

export class Card{

    /**@type {string} */
    authorID
    
    /**@type {Question} */
    question
    
    /**@type {Answer} */
    answer

    /**@type {Labelling} */
    labelling;

    /**
     * 
     * @param {string} authorID 
     * @param {Question} question 
     * @param {Answer} answer 
     * @param {Labelling | string[] | string} labels 
     */
    constructor(authorID, question, answer, labels){
        this.authorID = authorID;
        this.question = question;
        this.answer = answer;

        if(labels instanceof Labelling) {
            this.labelling = labels
        } else {
            this.labelling = new Labelling(labels);
        }
    }

    /**@returns {Card} */
    clone(){
        return new Card(this.getAuthorID(), this.getQuestion(), this.getAnswer(), this.getLabelling())
    }

    /**@returns {string} */
    getAuthorID() {
        return this.authorID;
    }

    /**@returns {Question} */
    getQuestion() {
        return this.question;
    }

    /**@returns {Answer} */
    getAnswer() {
        return this.answer;
    }

    /**@returns {Labelling} */
    getLabelling() {
        return this.labelling;
    }
}
