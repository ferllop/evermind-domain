import { Identification } from './value/Identification.js';

export abstract class Entity {

    private id: Identification

    constructor(id?: string) {
        this.id = Boolean(id) ? new Identification(id) : new Identification()
    }

    getId() {
        return this.id
    }

}
