import { precondition } from '../../../implementations/preconditions.js'

export class Hour {
    private readonly hour: string

    constructor(hour: number) {
        precondition(hour > -1 && hour < 24)
        this.hour = hour.toString().padStart(2, '0')
    }

    reclockDate(date: Date): Date {
        const iso = date.toString()
        return new Date(iso.replace(/(?<=\s)\d{2}(?=:)/, this.hour))
    }

}
