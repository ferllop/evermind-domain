import { Identification } from '../models/value/Identification.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { DomainError } from '../errors/DomainError.js'
import { CrudRepository } from '../storage/repositories/CrudRepository.js'
import { Mapper } from '../storage/storables/Mapper.js'
import { Entity } from '../models/Entity.js'
import { IdDto } from '../models/value/IdDto.js'

export class CrudController<T extends Entity, TDto extends IdDto> {

    constructor(
        private tableName: string, 
        private mapper: Mapper<T, TDto>){}

    

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
