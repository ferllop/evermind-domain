import { precondition } from '../../lib/preconditions.js'

export class Labelling {
    static LABEL_LIST_SEPARATOR = ','

    /**@type {string[]} */
    #labels

    /**@param {string[] | string} labels*/
    constructor(labels) {
        precondition(labels instanceof Array || typeof labels === 'string')
        if (labels instanceof Array) {
            for (const label of labels) {
                precondition(Labelling.isValid(label))
            }
            this.#labels = labels
        } else {
            this.#labels = this.toArray(labels)
        }
    }

    /**@returns {string} */
    toString() {
        if (!this.#labels) {
            return "unlabeled"
        }

        let result = ''
        for (const label of this.#labels) {
            result += label + Labelling.LABEL_LIST_SEPARATOR + ' '
        }
        return result.substring(0, result.length - 2)
    }

    /**
     * @param {string} labels
     * @returns {string[]} */
    toArray(labels) {
        const result = []
        for (const label of labels.toLowerCase().split(Labelling.LABEL_LIST_SEPARATOR)) {
            if (label.trim().length > 0) {
                precondition(Labelling.isValid(label.trim()))
                result.push(label.trim())
            }
        }
        return result
    }

    /**@returns {string[]} */
    getLabels() {
        return this.#labels
    }

    /**
     * @param {number} index
     * @returns {string}
     */
    getLabel(index) {
        precondition(index > -1 && index < this.#labels.length)
        return this.#labels[index]
    }

    /**
     * @param {string} label
     * @returns {boolean} */
    static isValid(label) {
        return ! (/.*[^-,\w\s].*/.test(label))
    }
}
