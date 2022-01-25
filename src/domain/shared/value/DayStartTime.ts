import { precondition } from '../../../implementations/preconditions.js'

export class DayStartTime {

    static readonly MIN = 0;
    static readonly MAX = 23;
    static readonly DEFAULT = 9;

    constructor(private readonly value: number = DayStartTime.DEFAULT) {
        precondition(DayStartTime.isValid(value))
    }

    static isValid(value: number) {
        const isInRange = value >= DayStartTime.MIN && value <= DayStartTime.MAX
        return Number.isInteger(value) && isInRange
    }

    getValue() {
        return this.value;
    }

    clone() {
        return new DayStartTime(this.getValue());
    }

    equals(hour: DayStartTime) {
        return this.value === hour.value;
    }

}
