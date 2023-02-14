import {AsyncDatabase} from 'in-memory-database'
import {IdDto} from '../../../types/dtos/IdDto.js'
import { precondition } from '../../preconditions.js'

export class InMemoryDatastore {

    private static db: AsyncDatabase = new AsyncDatabase()

    getDb() {
        return InMemoryDatastore.db
    }

    async create<T extends IdDto>(table: string, dto: T): Promise<boolean> {
        precondition(Boolean(dto.id))
        const result = await this.getDb().insert(table, dto)
        return result.error.code === 0
    }

    async read<T extends IdDto>(table: string, id: string): Promise<T | null> {
        precondition(await this.hasTable(table))
        const result = await this.getDb().findById(table, id)
        return result.data
    }

    async update<T extends IdDto>(table: string, dto: T): Promise<boolean> {
        precondition(await this.hasTable(table))
        const result = await this.getDb().update(table, dto)
        return result.error.code === 0
    }

    async delete(table: string, id: string): Promise<boolean> {
        precondition(Boolean(id) && await this.hasTable(table))
        const result = await this.getDb().delete(table, id)
        return result.error.code === 0
    }

    async findMany<T extends IdDto>(table: string, finder: (dto: T) => boolean): Promise<T[]> {
        const result = await this.getDb().find(table, finder)
        return result.data ?? []
    }

    async findOne<T extends IdDto>(table: string, finder: (dto: T) => boolean): Promise<T | null> {
        const result = await this.findMany(table, finder)
        return result.length > 0 ? result[0] : null
    }

    async hasTable(table: string): Promise<boolean> {
        return this.getDb().hasCollection(table)
    }

    async clean(): Promise<void> {
        return this.getDb().clean()
    }

}
