import {IdDto} from '../../src/domain/value/IdDto.js'
import {Mother} from './Mother.js'
import {IdentificationMother} from './value/IdentificationMother.js'
import {Datastore} from '../../src/domain/Datastore.js'

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
    
    async storedIn() {
        for(let i = 1; i <= this.qty; i++) {
            await this.datastore.create(this.mother.TABLE_NAME, this.mother.numberedDto(i))
        }
        return this
    }
    
    async exists(id: number) {
        return Boolean(await this.datastore.read<T>(this.mother.TABLE_NAME, IdentificationMother.numberedDto(id).id))
    }
    
    async stored(id: number) {
        this.storedDto = await this.datastore.read<T>(this.mother.TABLE_NAME, IdentificationMother.numberedDto(id).id)
        return this
    }
    
    hasPropertyValue(property: string, value: any) {
        return this.storedDto && (this.storedDto as Record<string, any>)[property] === value
    }
    
    async isDataStored(id: string, propertyToCheck: string ) {
        const readed = await this.datastore.read<T>(this.mother.TABLE_NAME, id)
        return readed && (readed as Record<string, any>)[propertyToCheck] === (this.mother.dto() as Record<string, any>)[propertyToCheck]
    }

}

