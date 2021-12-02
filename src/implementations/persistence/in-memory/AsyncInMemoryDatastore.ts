import {AsyncDatabase} from 'in-memory-database'
import {AsyncDatastore} from '../../../models/AsyncDatastore.js'
import {IdDto} from '../../../models/value/IdDto.js'
import { precondition } from '../../preconditions.js'

export class AsyncInMemoryDatastore implements AsyncDatastore {

    private db: AsyncDatabase

    constructor() {
        this.db = new AsyncDatabase()
    }

    async create<T extends IdDto>(table: string, dto: T): Promise<boolean> {
        precondition(Boolean(dto.id))
        const result = await this.db.insert(table, dto)
        return result.error.code === 0
    }

    async read<T extends IdDto>(table: string, id: string): Promise<T | null> {
        precondition(await this.hasTable(table))
        const result = await this.db.findById(table, id)
        return result.data
    }

    async update<T extends IdDto>(table: string, dto: T): Promise<boolean> {
        precondition(await this.hasTable(table))
        const result = await this.db.update(table, dto)
        return result.error.code === 0
    }

    async delete(table: string, id: string): Promise<boolean> {
        precondition(Boolean(id) && await this.hasTable(table))
        const result = await this.db.delete(table, id)
        return result.error.code === 0
    }

    async findMany<T extends IdDto>(table: string, finder: (dto: T) => boolean): Promise<T[]> {
        const result = await this.db.find(table, finder)
        return result.data ?? []
    }

    async findOne<T extends IdDto>(table: string, finder: (dto: T) => boolean): Promise<T | null> {
        const result = await this.findMany(table, finder)
        return result.length > 0 ? result[0] : null
    }

    async hasTable(table: string): Promise<boolean> {
        return this.db.hasCollection(table)
    }

    async clean(): Promise<void> {
        return this.db.clean()
    }

}
