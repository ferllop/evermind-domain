import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js';
import { IdDto } from '../../src/models/value/IdDto.js';

export class DatastoreTestClass extends InMemoryDatastore {
    dtoId!: string;

    create<T extends IdDto>(table: string, dto: T): boolean {
        this.dtoId = dto.id;
        return super.create(table, dto);
    }

}
