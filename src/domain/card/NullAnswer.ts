import { Answer } from './Answer.js'


export class NullAnswer extends Answer {
    getValue(): null {
        return null;
    }
    clone(): Answer {
        return new NullAnswer();
    }

}
