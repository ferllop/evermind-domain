import { Validator } from './Validator.js'
import { MayBeIdentified } from './value/MayBeIdentified.js'

export abstract class EntityFactory<T, TDto> {
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
}
