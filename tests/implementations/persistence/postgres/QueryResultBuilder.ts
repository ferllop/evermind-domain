export class QueryResultBuilder {
    private rows: any[] = []
    private command = ''
    private rowCount = 0
    private oid = 0
    private fields = []

    withRowCount(count: number) {
        this.rowCount = count
        return this
    }

    withRows(rows: any[]) {
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