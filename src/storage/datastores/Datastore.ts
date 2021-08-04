import { Identified } from './Identified';

export interface Datastore {

    create<T>(table: string, dto: T): boolean

    read<T>(table: string, id: string): Identified<T> | null

    update<T>(table: string, dto: Identified<T>): boolean

    delete(table: string, id: string): boolean

    find<T>(table: string, finder: (dto: T) => boolean): Identified<T>[]
    
    hasTable(table: string): boolean

    clean(): void

}
