import {IdDto} from '../../../models/value/IdDto.js'
import {Datastore} from '../../../models/Datastore.js'
import {precondition} from '../../preconditions.js'
import {SyncDatabase} from 'in-memory-database'

export class InMemoryDatastore implements Datastore {

    private db: SyncDatabase

    constructor() {
        this.db = new SyncDatabase()
    }

    create<T extends IdDto>(table: string, dto: T): boolean {
        const result = this.db.insert(table, dto)
        return result.error.code === 0
    }

    read<T extends IdDto>(table: string, id: string): T | null {
        precondition(this.hasTable(table))
        return this.db.findById(table, id).data
    }

    update<T extends IdDto>(table: string, dto: T): boolean {
        precondition(this.hasTable(table))
        const result = this.db.update(table, dto)
        return result.error.code === 0
    }

    delete(table: string, id: string): boolean {
        precondition(this.hasTable(table) && Boolean(id))
        const result = this.db.delete(table, id)
        return result.error.code === 0
    }

    findMany<T extends IdDto>(table: string, finder: (dto: T) => boolean): T[] {
        return this.db.find(table, finder).data ?? []
    }

    findOne<T extends IdDto>(table: string, finder: (dto: T) => boolean): T | null {
        const result = this.findMany(table, finder)
        return result.length > 0 ? result[0] : null
    }

    hasTable(table: string): boolean {
        return this.db.hasCollection(table)
    }

    clean() {
        return this.db.clean()
    }

}
