export abstract class Question {

    abstract getValue(): unknown
    abstract clone(): Question
    
}
