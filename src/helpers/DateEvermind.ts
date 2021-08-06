import { DateISO } from '../models/value/DateISO'

export class DateEvermind extends Date {
    constructor(dateString: DateISO) {
        super(dateString)
    }

    now(): DateEvermind {
        return new DateEvermind(new Date().toISOString() as DateISO)
    }

    isSame(date: Date): boolean {
        return this.getTime() === date.getTime()
    }

    isBefore(date: Date): boolean {
        return this.getTime() < date.getTime()
    }

    isAfter(date: Date): boolean {
        return this.getTime() > date.getTime()
    }

    isSameOrBefore(date: Date): boolean {
        return this.isSame(date) || this.isBefore(date)
    }

    isSameOrAfter(date: Date): boolean {
        return this.isSame(date) || this.isAfter(date)
    }

    isNow(): boolean {
        return this.isSame(this.now())
    }

    isNowOrBefore(): boolean {
        return this.isSameOrBefore(this.now())
    }

    isNowOrAfter(): boolean {
        return this.isSameOrAfter(this.now())
    }

    toDtoFormat(): DateISO {
        return this.toISOString() as DateISO
    }

    static isISOString(dateString: string): boolean {
        if (! /\dT\d.*Z$/.test(dateString)) {
            return false
        }
        return ! isNaN(new Date(dateString).getTime())
    }

}
