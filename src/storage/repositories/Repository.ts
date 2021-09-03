import { DomainError } from '../../errors/DomainError.js'
import { ErrorType } from '../../errors/ErrorType.js'
import { Entity } from '../../models/Entity.js'
import { IdDto } from '../../models/value/IdDto.js'
import { Identification } from '../../models/value/Identification.js'
import { Datastore } from '../datastores/Datastore.js'
import { Mapper } from '../storables/Mapper.js'


export abstract class Repository<T extends Entity, TDto extends IdDto> {
    
    private tableName: string
    private mapper: Mapper<T, TDto>
    protected datastore: Datastore

    constructor(tableName: string, mapper: Mapper<T, TDto>, dataStore: Datastore) {
        this.tableName = tableName
        this.mapper = mapper
        this.datastore = dataStore
    }

    store(entity: T): DomainError {
        const result = this.datastore.create(this.tableName, this.mapper.toDto(entity))
        if (!result) {
            return new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return DomainError.NULL
    }

    delete(id: Identification): boolean {
        if (! this.datastore.hasTable(this.tableName)) {
            return false
        }
        return this.datastore.delete(this.tableName, id.getId())
    }

    retrieve(id: Identification): T | null {
        if (!this.datastore.hasTable(this.tableName)) {
            return null
        }
        const result = this.datastore.read<TDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return null
        }
        return this.mapper.fromDto(result)
    }

    update(entity: T): boolean {
        if (!this.datastore.hasTable(this.tableName)) {
            return false
        }
        return this.datastore.update(this.tableName, this.mapper.toDto(entity))
    }

}
