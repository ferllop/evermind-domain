/**@abstract */
export class Answer {
    getAnswer() {
        throw new Error("getAnswer must be implemented in child class")
    }
}
