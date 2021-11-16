import {IdDto} from '../../../models/value/IdDto.js'
import {precondition} from '../../preconditions.js'
import {ErrorType, InMemoryDatastoreError} from './InMemoryDatastoreError.js'

class Table<T extends IdDto> {
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

export class SyncInMemoryDatabase {

    private tables: Map<string, Table<any>>

    constructor() {
        this.tables = new Map()
    }

    insert<T extends IdDto>(table: string, dto: T): boolean {
        if (!this.tables.has(table)) {
            this.tables.set(table, new Table<T>())
        }
        const alreadyExists = Boolean(this.tables.get(table)?.read(dto.id))
        if (alreadyExists) {
            throw new InMemoryDatastoreError(ErrorType.RESOURCE_ALREADY_EXISTS)
        }

        return new Promise(resolve => {
            setTimeout(() =>
                resolve(Boolean(this.tables.get(table)?.create(dto))), 100)
        })
    }

    update<T extends IdDto>(table: string, dto: T): boolean {
        precondition(this.hasTable(table))
        return Boolean(this.tables.get(table)?.update(dto))
    }

    delete(table: string, id: string): boolean {
        precondition(this.hasTable(table) && Boolean(id))
        return Boolean(this.tables.get(table)?.delete(id))
    }

    find<T extends IdDto>(table: string, finder: (dto: T) => boolean): T[] {
        precondition(this.hasTable(table))
        return this.tables.get(table)?.find(finder) ?? []
    }

    hasTable(table: string): boolean {
        return this.tables.has(table)
    }

    clean() {
        this.tables = new Map()
    }

    getTable(table: string) {
        return this.tables.get(table)
    }

    getTables() {
        return this.tables
    }

}
