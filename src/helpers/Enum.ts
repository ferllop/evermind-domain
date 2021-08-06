export class Enum {
    
    private ordinal: number

    constructor(values: any) {
        this.ordinal = values.length
        values.push(this)
    }

    getOrdinal() {
        return this.ordinal
    }
}
