import { IdDto } from '../../../src/models/value/IdDto.js';
import { InMemoryDatastore } from '../../../src/storage/datastores/InMemoryDatastore.js';

export class DatastoreTestClass extends InMemoryDatastore {
    dtoId!: string;

    create<T extends IdDto>(table: string, dto: T): boolean {
        this.dtoId = dto.id;
        return super.create(table, dto);
    }

}
