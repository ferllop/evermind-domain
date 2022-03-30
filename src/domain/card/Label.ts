import { precondition } from '../../implementations/preconditions.js'

export class Label {
    constructor(
        private readonly value: string
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

    clone() {
        return new Label(this.value)
    }

    static isValid(label: string): boolean {
        return label.length > 0 && !(/.*[^-,\w\s].*/.test(label))
    }
}
