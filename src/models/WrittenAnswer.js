export class WrittenAnswer {
    /**@type {string} */
    answer

    /**@param {string} answer */
    constructor(answer) {
        this.answer = answer
    }

    /**
     * @returns {string}
     */
    getAnswer() {
        return this.answer
    }
}
