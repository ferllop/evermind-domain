import { DomainError } from '../../../src/domain/errors/DomainError.js'
import { ErrorType } from '../../../src/domain/errors/ErrorType.js'
import { Entity } from '../../../src/domain/shared/Entity.js'
import { Mapper } from '../../../src/domain/shared/Mapper.js'
import { Validator } from '../../../src/domain/shared/Validator.js'
import { IdDto } from '../../../src/domain/shared/value/IdDto.js'
import { Identification } from '../../../src/domain/shared/value/Identification.js'
import { MayBeIdentified } from '../../../src/domain/shared/value/MayBeIdentified.js'
import { assert, suite } from '../../test-config.js'
import { ImplementationsContainer } from '../../../src/implementations/implementations-container/ImplementationsContainer.js'
import { InMemoryDatastore } from '../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { Repository } from '../../../src/domain/shared/Repository.js'
import { Dependency } from '../../../src/implementations/implementations-container/Dependency.js'
import { Datastore } from '../../../src/domain/shared/Datastore.js'

type Context = {
    table: string;
    db: Datastore;
    sut: TestRepository;
}

const repository = suite<Context>('Repository')

repository.before.each((context: Context) => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    context.table = 'testTable'
    context.db = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore
    context.sut = new TestRepository(context.table, new TestMapper())
})

repository(
    'given a non existing entity ' +
    'when executing this use case ' +
    'then return a RESOURCE_NOT_FOUND error', async ({sut}) => {
        const response = await sut.delete(new TestEntity())
        assert.equal(response, new DomainError(ErrorType.RESOURCE_NOT_FOUND))
    })

repository(
    'given a null entity ' +
    'when deleting it ' +
    'then return a INVALID_INPU_DATA error', async ({sut}) => {
        const response = await sut.delete(sut.getNull())
        assert.equal(response, new DomainError(ErrorType.INPUT_DATA_NOT_VALID))
    })

repository(
    'given a non-existing table and a criteria ' +
    'when any valid scenario ' +
    'returns an empty array', async ({sut}) => {
        const criteria = (dto: TestEntityDto) => dto.id === 'non-existing'
        const response = await sut.find(criteria)
        assert.equal(response, [])
    })

repository(
    'given a populated table and a criteria ' +
    'when does not finds any entity matching the criteria ' +
    'returns an empty array', async ({sut, table, db}) => {
        await givenAPopulatedDatabase(table, db)
        const criteria = (dto: TestEntityDto) => dto.id === 'non-existing'
        const response = await sut.find(criteria)
        assert.equal(response, [])
    })

repository(
    'given a populated table and a criteria ' +
    'when does find an entity matching the criteria ' +
    'returns an array with the element', async ({sut, table, db}) => {
        await givenAPopulatedDatabase(table, db)
        const existingEntity = givenAnEntity(1)
        const criteria = (dto: TestEntityDto) => {
            return existingEntity.getId().equals(new Identification(dto.id))
        }
        const response = await sut.find(criteria)
        assert.equal(response, [existingEntity])
    })

repository(
    'given a populated table and two criterias ' +
    'when trying to find entities matching either two criterias ' +
    'returns an array with the elements matching any of the two criterias', async ({sut, table, db}) => {
        await givenAPopulatedDatabase(table, db)
        const existingEntity1 = givenAnEntity(1)
        const existingEntity2 = givenAnEntity(2)
        const criteriaA = (dto: TestEntityDto) => {
            return existingEntity1.getId().equals(new Identification(dto.id))
        }
        const criteriaB = (dto: TestEntityDto) => {
            return existingEntity2.getId().equals(new Identification(dto.id))
        }
        const response = await sut.find((dto) => criteriaA(dto) || criteriaB(dto))
        assert.equal(response, [existingEntity1, existingEntity2])
    })

repository(
    'given a populated table and two criterias ' +
    'when trying to find entities matching two criterias ' +
    'returns an array with the elements matching the two criterias at the same time', async ({sut, table, db}) => {
        await givenAPopulatedDatabase(table, db)
        const existingEntity1 = givenAnEntity(1)
        const criteriaA = (dto: TestEntityDto) => {
            return existingEntity1.getId().equals(new Identification(dto.id))
        }
        const criteriaB = (dto: TestEntityDto) => {
            return dto.id.startsWith('someid#')
        }
        const response = await sut.find((dto) => criteriaA(dto) && criteriaB(dto))
        assert.equal(response, [existingEntity1])
    })

repository(
    'given a non existing table  ' +
    'when trying to find one entity ' +
    'returns the null entity', async ({sut}) => {
        const criteria = (dto: TestEntityDto) => {
            return dto === dto
        }
        const response = await sut.findOne(criteria)
        assert.equal(response, sut.getNull())
    })

repository(
    'given a populated table and a criteria ' +
    'when searching and not finding any matching entity ' +
    'returns the null entity', async ({sut, table, db}) => {
        await givenAPopulatedDatabase(table, db)
        const criteria = (dto: TestEntityDto) => {
            return dto !== dto
        }
        const response = await sut.findOne(criteria)
        assert.equal(response, sut.getNull())
    })

repository(
    'given a populated table and a criteria ' +
    'when searching and finding the matching entity ' +
    'returns the entity', async ({sut, table, db}) => {
        await givenAPopulatedDatabase(table, db)
        const criteria = (dto: TestEntityDto) => {
            return dto.id === 'someid#1'
        }
        const response = await sut.findOne(criteria)
        assert.equal(response, givenAnEntity(1))
    })

repository.run()

async function givenAPopulatedDatabase(table: string, db: Datastore) {
    for (let i = 0; i < 10; i++) {
        await db.create(table, givenAnEntityDto(i))
    }
}

function givenAnEntityDto(number: number): TestEntityDto {
    return { id: 'someid#' + number }
}

function givenAnEntity(number: number): TestEntity {
    return new TestMapper().fromDto(givenAnEntityDto(number))
}

class TestEntity extends Entity {
    constructor(id = Identification.create()) {
        super(id)
    }
}

class NullTestEntity extends TestEntity {
    static instance = new NullTestEntity(Identification.NULL)
    override isNull() {
        return true
    }
}

class TestRepository extends Repository<TestEntity, IdDto> {
    getNull(): TestEntity {
        return NullTestEntity.instance
    }
}

class TestMapper extends Mapper<TestEntity, TestEntityDto> {
    getValidators(): Map<string, Validator> {
        return new Map().set('id', Identification.isValid)
    }
    isDtoValid(dto: MayBeIdentified<TestEntityDto>): boolean {
        return 'id' in dto ? Identification.isValid(dto.id) : true
    }
    fromDto(dto: TestEntityDto): TestEntity {
        return new TestEntity(Identification.recreate(dto.id))
    }
    toDto(entity: TestEntity): TestEntityDto {
        return { id: entity.getId().getId() }
    }

}

type TestEntityDto = IdDto