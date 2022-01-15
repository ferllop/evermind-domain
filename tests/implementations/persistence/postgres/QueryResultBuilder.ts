export class QueryResultBuilder<T> {
    private rows: T[] = []
    private command = ''
    private rowCount = 0
    private oid = 0
    private fields = []

    withRowCount(count: number) {
        this.rowCount = count
        return this
    }

    withRows(rows: T[]) {
        this.rows = rows
        return this
    }

    build() {
        return {
            rows: this.rows,
            command: this.command,
            rowCount: this.rowCount,
            oid: this.oid,
            fields: this.fields,
        }
    }
}