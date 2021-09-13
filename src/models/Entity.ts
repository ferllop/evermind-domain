import { Identification } from './value/Identification.js';

export abstract class Entity {

    private id: Identification

    constructor(id: Identification) {
        this.id = id
    }

    getId() {
        return this.id
    }


    isNull() {
        return this.getId().isNull()
    }

    abstract getNull(): unknown

}
