export class WrittenQuestion {
    /**@type {string} */
    question

    /**@param {string} question */
    constructor(question) {
        this.question = question
    }

    /**
     * @returns {string}
     */
    getQuestion() {
        return this.question
    }
}
