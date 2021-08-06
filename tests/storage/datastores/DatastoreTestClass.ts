import { Identified } from '../../../src/storage/datastores/Identified.js';
import { InMemoryDatastore } from '../../../src/storage/datastores/InMemoryDatastore.js';

export class DatastoreTestClass extends InMemoryDatastore {
    dtoId!: string;

    create<T extends Identified<unknown>>(table: string, dto: T): boolean {
        this.dtoId = dto.id;
        return super.create(table, dto);
    }

}
