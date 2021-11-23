import {AsyncDatabase} from 'in-memory-database'
import {AsyncDatastore} from '../../../models/AsyncDatastore.js'
import {IdDto} from '../../../models/value/IdDto.js'

export class AsyncInMemoryDatastore implements AsyncDatastore {
    private db: AsyncDatabase

    constructor() {
        this.db = new AsyncDatabase()
    }

    async create(table: string, dto: IdDto): Promise<boolean> {
        const result = await this.db.insert(table, dto)
        return result.error.code === 0
    }

    async read<T extends IdDto>(table: string, id: string): Promise<T | null> {
        const result = await this.db.findById(table, id)
        return result.data
    }

    update(table: string, dto: IdDto): Promise<boolean> {
        throw new Error('Method not implemented.')
    }

    async delete(table: string, id: string): Promise<boolean> {
        const result = await this.db.delete(table, id)
        return result.error.code === 0
    }
    
    findMany<T extends IdDto>(table: string, finder: (dto: T) => boolean): Promise<T[]> {
        throw new Error('Method not implemented.')
    }
    
    findOne<T extends IdDto>(table: string, finder: (dto: T) => boolean): Promise<T | null> {
        throw new Error('Method not implemented.')
    }
    
    hasTable(table: string): Promise<boolean> {
        return Promise.resolve(this.db.hasCollection(table))
    }
    
    clean(): Promise<void> {
        return Promise.resolve(this.db.clean())
    }
}

