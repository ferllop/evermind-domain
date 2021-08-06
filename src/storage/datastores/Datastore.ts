import { Identified } from './Identified';

export interface Datastore {

    create<T extends Identified<unknown>>(table: string, dto: T): boolean

    read<T extends Identified<unknown>>(table: string, id: string): T | null

    update<T extends Identified<unknown>>(table: string, dto: T): boolean

    delete(table: string, id: string): boolean

    find<T extends Identified<unknown>>(table: string, finder: (dto: T) => boolean): T[]
    
    hasTable(table: string): boolean

    clean(): void

}
