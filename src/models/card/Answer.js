/**@abstract */
export class Answer {
    /** @returns {any} */
    getAnswer() {
        throw new Error("getAnswer must be implemented in child class")
    }
}
