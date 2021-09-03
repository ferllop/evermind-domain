import { IdDto } from '../../src/models/value/IdDto.js';


export interface Mother<T extends IdDto> {
    TABLE_NAME: string;
    numberedDto(number: number): T;
    dto(): T;
}
