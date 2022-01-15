import {PostgresDatastore} from "../PostgresDatastore";
import {QueryResult} from "pg";
import {UserRow} from "./UserRow";

export class UserPostgresDatastore extends PostgresDatastore {

    override async query(query: string): Promise<QueryResult<UserRow>> {
        return super.query(query)
    }
}