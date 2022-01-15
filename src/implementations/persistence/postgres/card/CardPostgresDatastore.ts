import {PostgresDatastore} from "../PostgresDatastore";
import {QueryResult} from "pg";
import {CardRow} from "./CardRow";

export class CardPostgresDatastore extends PostgresDatastore {
    override async query(query: string): Promise<QueryResult<CardRow>> {
        return super.query(query);
    }
}