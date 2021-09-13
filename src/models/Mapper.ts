import { Validator } from './Validator';
import { MayBeIdentified } from './value/MayBeIdentified';

export abstract class Mapper<T, TDto> {
    validators: Map<string, Validator>

    constructor() {
        this.validators = this.getValidators()
    }


    arePropertiesValid(card: Partial<TDto>) {
        return Object.entries(card).every(
            ([key, value]) => this.isPropertyValid(key, value))
    }

    isPropertyValid(key: string, value: any): boolean {
        const validator = this.validators.get(key)
        return validator ? validator(value) : false
    }

    abstract getValidators(): Map<string, Validator>
    abstract isDtoValid(dto: MayBeIdentified<TDto>): boolean;
    abstract fromDto(dto: TDto): T;
    abstract toDto(entity: T): TDto;
    abstract getNull(): T
}
