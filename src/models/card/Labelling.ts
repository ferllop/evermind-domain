import { precondition } from '../../lib/preconditions.js'

export class Labelling {
    static LABEL_LIST_SEPARATOR = ','

    private readonly labels: string[]

    constructor(labels: string[] | string) {
        const labelsArray = this.toArray(labels)
        precondition(Labelling.areValid(labelsArray))
        this.labels = labelsArray.map(label => label.toLowerCase())
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

    toArray(labels: string|string[]): string[] {
        if (labels instanceof Array) {
            return labels
        }

        const result: string[] = []
        for (const label of labels.toLowerCase().split(Labelling.LABEL_LIST_SEPARATOR)) {
            if (label.trim().length > 0) {
                precondition(Labelling.isValid(label.trim()))
                result.push(label.trim())
            }
        }
        return result
    }

    getLabels(): string[] {
        return this.labels
    }

    getLabel(index: number): string {
        precondition(index > -1 && index < this.labels.length)
        return this.labels[index]
    }

    includesAllLabels(labels: string[]) {
        return this.labels.every(label => labels.includes(label))
    }

    clone() {
        return new Labelling(this.getLabels())
    }

    static isValid(label: string): boolean {
        return !(/.*[^-,\w\s].*/.test(label))
    }

    static areValid(labels: string[]): boolean {
        return labels.length > 0 && labels.every(label => Labelling.isValid(label))
    }
}
