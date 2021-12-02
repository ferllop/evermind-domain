import {IdDto} from '../../src/models/value/IdDto.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'

export class DatastoreTestClass extends InMemoryDatastore {
    dtoId!: string;

    override async create<T extends IdDto>(table: string, dto: T) {
        this.dtoId = dto.id;
        return super.create(table, dto);
    }

}
