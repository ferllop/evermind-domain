export class Enum {
    
    private readonly ordinal: number

    constructor(values: any) {
        this.ordinal = values.length
        values.push(this)
    }

    getOrdinal() {
        return this.ordinal
    }
}
