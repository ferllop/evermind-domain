import {IdDto} from '../../src/models/value/IdDto.js'
import {AsyncInMemoryDatastore} from '../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'

export class AsyncDatastoreTestClass extends AsyncInMemoryDatastore {
    dtoId!: string;

    async create<T extends IdDto>(table: string, dto: T) {
        this.dtoId = dto.id;
        return super.create(table, dto);
    }

}
