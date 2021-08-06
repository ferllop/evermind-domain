import { Identification } from './value/Identification.js';

export abstract class Entity {

    private id: Identification

    constructor(id: Identification) {
        this.id = id
    }

    getId(): Identification {
        return this.id
    }

}
