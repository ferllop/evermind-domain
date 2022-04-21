import {UserRow} from '../../../../../src/implementations/persistence/postgres/user/UserRow.js'
import {UserPostgresMapper} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresMapper.js'
import {assertObjectListsAreEqualsInAnyOrder} from '../AssertObjectListsAreEqualsInAnyOrder.js'
import {StoredUser} from '../../../../../src/domain/user/StoredUser.js'

export function assertAllRowsAreEqualToUsers(rows: UserRow[], users: StoredUser[]) {
    const userRows = rows.map(new UserPostgresMapper().rowToUser)
    assertObjectListsAreEqualsInAnyOrder(userRows, users)
}