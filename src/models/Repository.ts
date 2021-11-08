import {DomainError} from './errors/DomainError.js'
import {ErrorType} from './errors/ErrorType.js'
import {Entity} from './Entity.js'
import {IdDto} from './value/IdDto.js'
import {Identification} from './value/Identification.js'
import {Criteria} from './Criteria'
import {Datastore} from './Datastore.js'
import {Mapper} from './Mapper.js'
import {ImplementationsContainer} from '../implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../implementations/implementations-container/Dependency.js'


export abstract class Repository<T extends Entity, TDto extends IdDto> {
    
    private tableName: string
    private mapper: Mapper<T, TDto>
    protected datastore: Datastore

    constructor(tableName: string, mapper: Mapper<T, TDto>) {
        this.tableName = tableName
        this.mapper = mapper
        this.datastore = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    }

    store(entity: T): DomainError {
        const result = this.datastore.create(this.tableName, this.mapper.toDto(entity))
        if (!result) {
            return new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        } 
        return DomainError.NULL
    }

    delete(entity: T): DomainError {
        if (entity.isNull()) {
            return new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        if (!this.datastore.hasTable(this.tableName)) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const deleted = this.datastore.delete(this.tableName, entity.getId().getId())
        if (!deleted) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        return DomainError.NULL
    }

    retrieve(id: Identification): T {
        if (!this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const result = this.datastore.read<TDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return this.getNull()
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

    find(criteria: Criteria<TDto>): T[] {
        if (!this.datastore.hasTable(this.tableName)) {
            return []
        }
        
        return this.datastore
            .findMany(this.tableName, criteria)
            .map(dto => this.mapper.fromDto(dto))
    }

    findOne(criteria: Criteria<TDto>): T {
        if (!this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }
        
        const result = this.datastore.findOne(this.tableName, criteria)

        if (!result) {
            return this.getNull()
        }

        return this.mapper.fromDto(result)
    }

    abstract getNull(): T

}


