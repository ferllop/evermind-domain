import { IdDto } from './value/IdDto.js'
import { Id } from './value/Id.js'

export interface AsyncDatastore {

    create(table: string, dto: IdDto): Promise<boolean>

    read<T extends IdDto>(table: string, id: Id): Promise<T | null>

    update(table: string, dto: IdDto): Promise<boolean>

    delete(table: string, id: Id): Promise<boolean>

    findMany<T extends IdDto>(table: string, finder: (dto: T) => boolean): Promise<T[]>

    findOne<T extends IdDto>(table: string, finder: (dto: T) => boolean): Promise<T | null>

    hasTable(table: string): Promise<boolean>

    clean(): Promise<void>
}
