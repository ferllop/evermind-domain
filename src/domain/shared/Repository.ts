import {DomainError} from '../errors/DomainError.js'
import {ErrorType} from '../errors/ErrorType.js'
import {Entity} from './Entity.js'
import {IdDto} from './value/IdDto.js'
import {Identification} from './value/Identification.js'
import {Criteria} from './Criteria.js'
import {Mapper} from './Mapper.js'
import {ImplementationsContainer} from '../../implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../implementations/implementations-container/Dependency.js'
import {Datastore} from './Datastore.js'


export abstract class Repository<T extends Entity, TDto extends IdDto> {
    
    protected readonly tableName: string
    protected mapper: Mapper<T, TDto>
    protected datastore: Datastore

    constructor(tableName: string, mapper: Mapper<T, TDto>) {
        this.tableName = tableName
        this.mapper = mapper
        this.datastore = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    }

    async add(entity: T) {
        const result = await this.datastore.create(this.tableName, this.mapper.toDto(entity))
        if (!result) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
    }

    async delete(entity: T) {
        if (entity.isNull()) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const deleted = await this.datastore.delete(this.tableName, entity.getId().getId())
        if (!deleted) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

    }

    async findById(id: Identification): Promise<T> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const result = await this.datastore.read<TDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return this.getNull()
        }
        
        return this.mapper.fromDto(result)
    }

    async update(entity: T) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        const updated = this.datastore.update(this.tableName, this.mapper.toDto(entity))
        if(!updated) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
    }

    async find(criteria: Criteria<TDto>): Promise<T[]> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return []
        }
        const result = await this.datastore.findMany(this.tableName, criteria)
        return result.map(dto => this.mapper.fromDto(dto))
    }

    async findOne(criteria: Criteria<TDto>) {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }
        
        const result = await this.datastore.findOne(this.tableName, criteria)

        if (!result) {
            return this.getNull()
        }

        return this.mapper.fromDto(result)
    }

    abstract getNull(): T

}


