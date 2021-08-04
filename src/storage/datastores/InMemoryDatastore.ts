import { precondition } from '../../lib/preconditions.js'
import { Datastore } from './Datastore.js'
import { Identified } from './Identified'

class Table<T> {
    private rows: Map<string, Identified<T>>

    constructor() {
        this.rows = new Map()
    }

    create(dto: Identified<T>): boolean {
        precondition(dto.id)
        const previousSize = this.rows.size
        this.rows.set(dto.id, dto)
        return this.rows.size === previousSize + 1
    }

    
    read(id: string): Identified<T> | null {
        precondition(Boolean(id))
        const data = this.rows.get(id)
        return data ?? null
    }

    update(dto: Identified<T>): boolean {
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
    
    create<T>(table: string, dto: Identified<T>): boolean {
        precondition(dto.id)
        if (!this.tables.has(table)) {
            this.tables.set(table, new Table<T>())
        }
        return Boolean(this.tables.get(table)?.create(dto))
    }

    read<T>(table: string, id: string): Identified<T> | null {
        precondition(this.hasTable(table))
        return this.tables.get(table)?.read(id) ?? null
    }

    update<T>(table: string, dto: T): boolean {
        precondition(this.hasTable(table))
        return Boolean(this.tables.get(table)?.update(dto))
    }

    delete(table: string, id: string): boolean {
        precondition(this.hasTable(table) && Boolean(id))
        return Boolean(this.tables.get(table)?.delete(id))
    }

    find<T>(table: string, finder: (dto: T) => boolean): Identified<T>[] {
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
