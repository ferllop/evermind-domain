import { DateISO } from './DateISO'

export class DateEvermind extends Date {
    constructor(dateString: DateISO) {
        super(dateString)
    }

    static fromNow() {
        return DateEvermind.fromDate(new Date())
    }

    now(): DateEvermind {
        return DateEvermind.fromNow()   
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

    addDays(days: number) {
        const MILLISECONDS_IN_A_DAY = 86_400_000
        return DateEvermind.fromDate(new Date(this.getTime() + MILLISECONDS_IN_A_DAY * days))
    }

    static isISOString(dateString: string): boolean {
        if (! /\dT\d.*Z$/.test(dateString)) {
            return false
        }
        return ! isNaN(new Date(dateString).getTime())
    }

    static fromDate(date: Date) {
        return new DateEvermind(date.toISOString() as DateISO)
    }
}
