import { precondition } from '../../lib/preconditions.js'
import { Datastore } from './Datastore.js'
import { Identified } from './Identified.js'

class Table<T extends Identified<unknown>> {
    private rows: Map<string, T>

    constructor() {
        this.rows = new Map()
    }

    create(dto: T): boolean {
        precondition(dto.id)
        const previousSize = this.rows.size
        this.rows.set(dto.id, dto)
        return this.rows.size === previousSize + 1
    }

    
    read(id: string): T | null {
        precondition(Boolean(id))
        const data = this.rows.get(id)
        return data ?? null
    }

    update(dto: T): boolean {
        precondition(dto.id)
        if (!this.rows.has(dto.id)) {
            return false
        }
        const preupdateData = this.read(dto.id)
        this.rows.set(dto.id, { ...preupdateData, ...dto })
        return true
    }

    delete(id: string): boolean {
        return this.rows.delete(id)
    }

    find(finder: (dto: T) => boolean): T[] {
        let result: T[] = []
        this.rows.forEach( row => {
            if(finder(row)) {
                result = result.concat(row)
            }
        })
        return result
    }
}

export class InMemoryDatastore implements Datastore {

    private tables: Map<string, Table<any>>

    constructor() {
        this.tables = new Map()
    }
    
    create<T extends Identified<unknown>>(table: string, dto: T): boolean {
        precondition(dto.id)
        if (!this.tables.has(table)) {
            this.tables.set(table, new Table<T>())
        }
        return Boolean(this.tables.get(table)?.create(dto))
    }

    read<T extends Identified<unknown>>(table: string, id: string): T | null {
        precondition(this.hasTable(table))
        return this.tables.get(table)?.read(id) ?? null
    }

    update<T extends Identified<unknown>>(table: string, dto: T): boolean {
        precondition(this.hasTable(table))
        return Boolean(this.tables.get(table)?.update(dto))
    }

    delete(table: string, id: string): boolean {
        precondition(this.hasTable(table) && Boolean(id))
        return Boolean(this.tables.get(table)?.delete(id))
    }

    find<T extends Identified<unknown>>(table: string, finder: (dto: T) => boolean): T[] {
        precondition(this.hasTable(table)) 
        return this.tables.get(table)?.find(finder) ?? []
    }

    hasTable(table: string): boolean {
        return this.tables.has(table)
    }

    clean() {
        this.tables = new Map()
    }

}
