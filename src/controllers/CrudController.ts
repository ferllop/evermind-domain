import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { DomainError } from '../errors/DomainError.js'
import { CrudRepository } from '../storage/repositories/CrudRepository.js'
import { Mapper } from '../storage/storables/Mapper.js'
import { Entity } from '../models/Entity.js'
import { Unidentified } from '../storage/datastores/Unidentified'
import { IdDto } from '../models/value/IdDto.js'

export class CrudController<T extends Entity, TDto extends IdDto> {

    constructor(
        private tableName: string, 
        private mapper: Mapper<T, TDto>){}

    store(dto: Unidentified<TDto>, datastore: Datastore): DomainError {
        const result = new CrudRepository(this.tableName, this.mapper, datastore).store(dto)
        if (!result) {
            return new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return DomainError.NULL
    }

    delete(id: Identification, datastore: Datastore): DomainError {
        const deleted = new CrudRepository(this.tableName, this.mapper, datastore).delete(id)
        if (!deleted) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return DomainError.NULL
    }

    retrieve(id: Identification, datastore: Datastore): DomainError | T {
        const entityRetrieved = new CrudRepository(this.tableName, this.mapper, datastore).retrieve(id)
        if (!entityRetrieved) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return entityRetrieved
    }

    update(entity: T, datastore: Datastore): DomainError {
        const updated = new CrudRepository(this.tableName, this.mapper, datastore).update(entity)
        if(!updated) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        return DomainError.NULL
    }

}
