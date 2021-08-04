import { Identified } from '../datastores/Identified.js';

export interface Mapper<T, TDto> {
    isDtoValid(dto: TDto): boolean;
    fromDto(dto: Identified<TDto>): T;
    toDto(entity: T): Identified<TDto>;
}
