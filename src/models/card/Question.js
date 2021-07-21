/**@abstract */
export class Question {
    /** @returns {any} */
    getQuestion() {
        throw new Error("getQuestion must be implemented in child class")
    }
}
