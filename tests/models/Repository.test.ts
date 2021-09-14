import { DomainError } from '../../src/errors/DomainError.js'
import { ErrorType } from '../../src/errors/ErrorType.js'
import { Entity } from '../../src/models/Entity.js'
import { Mapper } from '../../src/models/Mapper.js'
import { Repository } from '../../src/models/Repository.js'
import { Validator } from '../../src/models/Validator.js'
import { IdDto } from '../../src/models/value/IdDto.js'
import { Identification } from '../../src/models/value/Identification.js'
import { MayBeIdentified } from '../../src/models/value/MayBeIdentified.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { assert, suite } from '../test-config.js'

const repository = suite('Repository')

repository(
    'given a non existing user ' +
    'when executing this use case ' +
    'then return a RESOURCE_NOT_FOUND error', () => {
        const table = 'testTable'
        const db = new InMemoryDatastore()
        const sut = new TestRepository(table, new TestMapper(), db)
        const entity = new TestEntity()
        const response = sut.delete(entity)
        assert.equal(response, new DomainError(ErrorType.RESOURCE_NOT_FOUND))
    })

repository(
    'given a null user ' +
    'when deleting it ' +
    'then return a INVALID_INPU_DATA error', () => {
        const table = 'testTable'
        const db = new InMemoryDatastore()
        const sut = new TestRepository(table, new TestMapper(), db)
        const entity = sut.getNull()
        const response = sut.delete(entity)
        assert.equal(response, new DomainError(ErrorType.INPUT_DATA_NOT_VALID))
    })

repository.run()

class TestEntity extends Entity {
    constructor(id = Identification.create()) {
        super(id)
    }
}

class TestRepository extends Repository<TestEntity, IdDto> {
    getNull(): TestEntity {
        return new class extends TestEntity { 
            isNull() {return true}
        }()
    }
}

class TestMapper extends Mapper<TestEntity, IdDto> {
    getValidators(): Map<string, Validator> {
        return new Map().set('id', Identification.isValid)
    }
    isDtoValid(dto: MayBeIdentified<IdDto>): boolean {
        return 'id' in dto ? Identification.isValid(dto.id) : true
    }
    fromDto(dto: IdDto): TestEntity {
        return new TestEntity(Identification.recreate(dto.id))
    }
    toDto(entity: TestEntity): IdDto {
        return { id: entity.getId().getId() }
    }

}
