import {UserRow} from "../../../../../src/implementations/persistence/postgres/user/UserRow";
import {User} from "../../../../../src/domain/user/User";
import {UserPostgresMapper} from "../../../../../src/implementations/persistence/postgres/user/UserPostgresMapper";
import {assertObjectListsAreEqualsInAnyOrder} from "../AssertObjectListsAreEqualsInAnyOrder";

export function assertAllRowsAreEqualToUsers(rows: UserRow[], users: User[]) {
    const userRows = rows.map(new UserPostgresMapper().rowToUser)
    assertObjectListsAreEqualsInAnyOrder(userRows, users)
}