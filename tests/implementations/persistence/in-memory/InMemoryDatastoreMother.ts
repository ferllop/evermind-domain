import {IdDto} from '../../../../src/domain/shared/value/IdDto.js'
import {Mother} from '../../../domain/shared/Mother.js'
import {IdentificationMother} from '../../../domain/value/IdentificationMother.js'
import {InMemoryDatastore} from '../../../../src/implementations/persistence/in-memory/InMemoryDatastore'

export class InMemoryDatastoreMother<T extends IdDto> {
        
    qty: number = 0
    storedDto?: T | null
    
    mother: Mother<T>
    datastore: InMemoryDatastore
    
    constructor(mother: Mother<T>, datastore: InMemoryDatastore) {
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
        const found = await this.datastore.read<T>(this.mother.TABLE_NAME, id)
        return found && (found as Record<string, any>)[propertyToCheck] === (this.mother.dto() as Record<string, any>)[propertyToCheck]
    }

}

