import { Entity } from '../../models/Entity.js'
import { IdDto } from '../../models/value/IdDto.js'
import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'
import { Mapper } from '../storables/Mapper.js'


export class CrudRepository<T extends Entity, TDto extends IdDto> {
    
    private tableName: string
    private mapper: Mapper<T, TDto>
    private dataStore: Datastore

    constructor(tableName: string, mapper: Mapper<T, TDto>, dataStore: Datastore) {
        this.tableName = tableName
        this.mapper = mapper
        this.dataStore = dataStore
    }

    store(entity: T): boolean {
        return this.dataStore.create(this.tableName, this.mapper.toDto(entity))
    }

    delete(id: Identification): boolean {
        if (! this.dataStore.hasTable(this.tableName)) {
            return false
        }
        return this.dataStore.delete(this.tableName, id.getId())
    }

    retrieve(id: Identification): T | null {
        if (!this.dataStore.hasTable(this.tableName)) {
            return null
        }
        const result = this.dataStore.read<TDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return null
        }
        return this.mapper.fromDto(result)
    }

    update(entity: T): boolean {
        if (!this.dataStore.hasTable(this.tableName)) {
            return false
        }
        return this.dataStore.update(this.tableName, this.mapper.toDto(entity))
    }

}
