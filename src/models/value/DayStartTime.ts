import { precondition } from '../../lib/preconditions.js';

export class DayStartTime {

    static readonly MIN = 0;
    static readonly MAX = 23;

    constructor(private readonly value: number) {
        precondition(DayStartTime.isValid(value));
    }

    static isValid(value: number) {
        const isInRange = value >= this.MIN && value <= this.MAX
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
