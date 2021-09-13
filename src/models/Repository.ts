import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Entity } from '../models/Entity.js'
import { IdDto } from '../models/value/IdDto.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from './Datastore.js'
import { Mapper } from './Mapper.js'


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

    delete(id: Identification): DomainError {
        if (!this.datastore.hasTable(this.tableName)) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const deleted = this.datastore.delete(this.tableName, id.getId())
        if (!deleted) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return DomainError.NULL
    }

    retrieve(id: Identification): T {
        if (!this.datastore.hasTable(this.tableName)) {
            return this.mapper.getNull()
            // return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const result = this.datastore.read<TDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return this.mapper.getNull()
            // return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return this.mapper.fromDto(result)
    }

    update(entity: T): DomainError {
        if (!this.datastore.hasTable(this.tableName)) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        const updated = this.datastore.update(this.tableName, this.mapper.toDto(entity))
        if(!updated) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return DomainError.NULL
    }

}
