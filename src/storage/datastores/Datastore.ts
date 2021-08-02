import { Identified } from './Identified';

export interface Datastore {

    create<T extends Identified>(table: string, dto: T): boolean

    read<T extends Identified>(table: string, id: string): T | null

    update<T extends Identified>(table: string, dto: T): boolean

    delete(table: string, id: string): boolean
    
    hasTable(table: string): boolean

    clean(): void

}
