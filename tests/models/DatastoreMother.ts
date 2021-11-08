import { Datastore } from '../../src/models/Datastore.js'
import { IdDto } from '../../src/models/value/IdDto.js'
import { Mother } from './Mother.js'
import { IdentificationMother } from './value/IdentificationMother.js'

export class DatastoreMother<T extends IdDto> {
        
    qty: number = 0
    storedDto?: T | null
    
    mother: Mother<T>
    datastore: Datastore
    
    constructor(mother: Mother<T>, datastore: Datastore) {
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
        return Boolean(this.datastore.read<T>(this.mother.TABLE_NAME, IdentificationMother.numberedDto(id).id))
    }
    
    stored(id: number) {
        this.storedDto = this.datastore.read<T>(this.mother.TABLE_NAME, IdentificationMother.numberedDto(id).id)
        return this
    }
    
    hasPropertyValue(property: string, value: any) {
        return this.storedDto && (this.storedDto as Record<string, any>)[property] === value
    }
    
    isDataStored(id: string, propertyToCheck: string ) {
        const readed = this.datastore.read<T>(this.mother.TABLE_NAME, id)
        return readed && (readed as {[key:string]: any})[propertyToCheck] === (this.mother.dto() as Record<string, any>)[propertyToCheck]
    }

}
