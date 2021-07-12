/**@abstract */
export class Question {
    getQuestion() {
        throw new Error("getQuestion must be implemented in child class")
    }
}
