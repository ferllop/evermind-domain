import { precondition } from '../../lib/preconditions.js'

export class Labelling {
    static LABEL_LIST_SEPARATOR = ','

    private labels: string[]

    constructor(labels: string[] | string) {
        precondition(labels instanceof Array || typeof labels === 'string')
        if (labels instanceof Array) {
            for (const label of labels) {
                precondition(Labelling.isValid(label))
            }
            this.labels = labels.map(label => label.toLowerCase())
        } else {
            this.labels = this.toArray(labels)
        }
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

    toArray(labels: string): string[] {
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

    static isValid(label: string): boolean {
        return ! (/.*[^-,\w\s].*/.test(label))
    }

     static areValid(labels: string[]): boolean {
        return labels.length > 0 && labels.every(label => Labelling.isValid(label))
    }
}
