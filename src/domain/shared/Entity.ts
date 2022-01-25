import { Identification } from './value/Identification.js'

export abstract class Entity {

    private readonly id: Identification

    protected constructor(id: Identification) {
        this.id = id
    }

    getId() {
        return this.id
    }

    isNull() {
        return false
    }

}
