import { precondition } from '../lib/preconditions.js'

export class Hour {
    /**@type {string} */
    #hour

    /**@param {number} hour*/
    constructor(hour) {
        precondition(hour > -1 && hour < 24)
        this.#hour = hour.toString().padStart(2, '0')
    }

    /**
     * @param {Date} date
     * @returns {Date}
     */
    reclockDate(date) {
        const iso = date.toString()
        return new Date(iso.replace(/(?<=\s)\d{2}(?=:)/, this.#hour))
    }

}
