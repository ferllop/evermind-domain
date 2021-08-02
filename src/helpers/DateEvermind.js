export class DateEvermind extends Date {
    /**
     * @returns {DateEvermind}
     */
    now() {
        return new DateEvermind()
    }

    /** 
     * @param {Date} date 
     * @returns {Boolean}
     */
    isSame(date) {
        return this.getTime() === date.getTime()
    }

    /** 
     * @param {Date} date 
     * @returns {Boolean}
     */
    isBefore(date) {
        return this.getTime() < date.getTime()
    }

    /** 
     * @param {Date} date 
     * @returns {Boolean}
     */
    isAfter(date) {
        return this.getTime() > date.getTime()
    }

    /** 
     * @param {Date} date 
     * @returns {Boolean}
     */
    isSameOrBefore(date) {
        return this.isSame(date) || this.isBefore(date)
    }

    /** 
     * @param {Date} date 
     * @returns {Boolean}
     */
    isSameOrAfter(date) {
        return this.isSame(date) || this.isAfter(date)
    }

    /** 
     * @returns {Boolean}
     */
    isNow() {
        return this.isSame(this.now())
    }

    /** 
     * @returns {Boolean}
     */
    isNowOrBefore() {
        return this.isSameOrBefore(this.now())
    }

    /** 
     * @returns {Boolean}
     */
    isNowOrAfter() {
        return this.isSameOrAfter(this.now())
    }

    toDtoFormat() {
        return this.toISOString()
    }

    /**
     * @param {string} dateString 
     * @returns {boolean}
     */
    static isISOString(dateString) {
        if (! /\dT\d.*Z$/.test(dateString)) {
            return false
        }
        return ! isNaN(new Date(dateString).getTime())
    }

}
