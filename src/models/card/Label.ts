import { precondition } from '../../lib/preconditions.js'

export class Label {
    constructor(
        private value: string
    ) { 
        precondition(Label.isValid(value))
        this.value = value.toLowerCase().trim()
    }

    equals(label: Label) {
        return this.value === label.value
    }

    getValue() {
        return this.value
    }

    toString() {
        return this.getValue()
    }

    static isValid(label: string): boolean {
        return label.length > 0 && !(/.*[^-,\w\s].*/.test(label))
    }
}
