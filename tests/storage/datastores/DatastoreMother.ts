import { Identified } from '../../../src/storage/datastores/Identified.js'
import { Datastore } from '../../../src/storage/datastores/Datastore.js'
import { IdentificationMother } from '../../models/value/IdentificationMother.js'

interface Mother {
    TABLE_NAME: string
    numberedDto(number: number): Identified & any
    dto(): Identified & any
}

export class DatastoreMother {
        
    qty: number = 0
    storedDto: Identified & any = {id: ''}
    
    mother: Mother
    datastore: Datastore
    
    /** @param {Datastore} datastore */
    constructor(mother: Mother, datastore: Datastore) {
        this.mother = mother
        this.datastore = datastore
    }

    having(qty: number) {
        this.qty = qty
        return this
    }
    
    storedIn() {
        for(let i = 1; i <= this.qty; i++) {
            this.datastore.create(this.mother.TABLE_NAME, this.mother.numberedDto(i))
        }
        return this
    }
    
    exists(id: number) {
        return Boolean(this.datastore.read(this.mother.TABLE_NAME, IdentificationMother.numberedDto(id).id))
    }
    
    stored(id: number) {
        this.storedDto = this.datastore.read<Identified>(this.mother.TABLE_NAME, IdentificationMother.numberedDto(id).id)
        return this
    }
    
    hasPropertyValue(property: string, value: any) {
        return this.storedDto && this.storedDto[property] === value
    }
    
    isDataStored(propertyToCheck: string ) {
        const readed = this.datastore.read<Identified & any>(this.mother.TABLE_NAME, this.mother.dto().id)
        return readed && readed[propertyToCheck] === this.mother.dto()[propertyToCheck]
    }

}
