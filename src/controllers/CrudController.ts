import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { DomainError } from '../errors/DomainError.js'
import { CrudRepository } from '../storage/repositories/CrudRepository.js'
import { Mapper } from '../storage/storables/Mapper.js'

export class CrudController<T, TDto> {

    constructor(private tableName: string, private mapper: Mapper<T, TDto>){}

    store(entity: T, datastore: Datastore): DomainError {
        const result = new CrudRepository(this.tableName, this.mapper, datastore).store(entity)
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
