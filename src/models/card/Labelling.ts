import { precondition } from '../../lib/preconditions.js'
import { Label } from './Label.js'

export class Labelling {
    static LABEL_LIST_SEPARATOR = ','
    static NULL = new Labelling([])
    
    constructor(
        private readonly labels: Label[]
    ) {}

    static fromStringLabels(labels: string[]) {
        return new Labelling(labels.map(stringLabel => new Label(stringLabel)))
    }

    toString(): string {
        if (!this.labels) {
            return "unlabeled"
        }

        let result = ''
        for (const label of this.labels) {
            result += label + Labelling.LABEL_LIST_SEPARATOR + ' '
        }
        return result.substring(0, result.length - 2)
    }

    getLabels() {
        return this.labels
    }

    getLabel(index: number) {
        precondition(index > -1 && index < this.labels.length)
        return this.labels[index]
    }

    isIncluded(labelling: Labelling) {
        return this.labels.every(label => labelling.includes(label))
    }

    includes(label: Label) {
        return this.labels.some(ownLabel => label.equals(ownLabel))
    }

    clone() {
        return new Labelling(this.getLabels())
    }

    static isValid(labels: string[]): boolean {
        return labels.length > 0 && labels.every(label => Label.isValid(label))
    }
}
