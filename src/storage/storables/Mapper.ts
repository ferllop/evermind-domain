import { MayBeIdentified } from './MayBeIdentified';

export interface Mapper<T, TDto> {
    isDtoValid(dto: MayBeIdentified<TDto>): boolean;
    fromDto(dto: TDto): T;
    toDto(entity: T): TDto;
}
