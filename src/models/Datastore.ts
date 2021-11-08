import { IdDto } from './value/IdDto';

export interface Datastore {

    create<T extends IdDto>(table: string, dto: T): boolean

    read<T extends IdDto>(table: string, id: string): T | null

    update<T extends IdDto>(table: string, dto: T): boolean

    delete(table: string, id: string): boolean

    findMany<T extends IdDto>(table: string, finder: (dto: T) => boolean): T[]

    findOne<T extends IdDto>(table: string, finder: (dto: T) => boolean): T | null
    
    hasTable(table: string): boolean

    clean(): void

}
