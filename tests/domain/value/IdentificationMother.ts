import { IdDto } from '../../../src/domain/value/IdDto'

export class IdentificationMother {
    
    static invalidDto(): IdDto  {
        return { id: ''}
    }

    static dto(): IdDto{
        return { id: 'the-id'}
    }

    static numberedDto(number: number): IdDto {
        return { id: this.dto().id + number}
    }
}
