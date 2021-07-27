import { Datastore } from '../../../src/storage/datastores/Datastore.js'
import { IdentificationMother } from '../../models/value/IdentificationMother.js'

export class DatastoreMother {
        
    qty
    storedDto
    
    mother
    datastore
    
    /** @param {Datastore} datastore */
    constructor(mother, datastore) {
        this.mother = mother
        this.datastore = datastore
    }

    /** @param {number} qty */
    having(qty) {
        this.qty = qty
        return this
    }
    
    storedIn() {
        for(let i = 1; i <= this.qty; i++) {
            this.datastore.create(this.mother.TABLE_NAME, this.mother.numberedDto(i))
        }
        return this
    }
    
    exists(id) {
        return Boolean(this.datastore.read(this.mother.TABLE_NAME, IdentificationMother.numberedDto(id).id))
    }
    
    stored(id) {
        this.storedDto = this.datastore.read(this.mother.TABLE_NAME, IdentificationMother.numberedDto(id).id)
        return this
    }
    
    hasPropertyValue(property, value) {
        return this.storedDto[property] === value
    }
    
    isDataStored(propertyToCheck) {
        return this.datastore.read(this.mother.TABLE_NAME, this.mother.dto().id)[propertyToCheck] === this.mother.dto()[propertyToCheck]
    }

}
