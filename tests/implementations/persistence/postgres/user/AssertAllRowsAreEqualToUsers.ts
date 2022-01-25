import {UserRow} from '../../../../../src/implementations/persistence/postgres/user/UserRow.js'
import {User} from '../../../../../src/domain/user/User.js'
import {UserPostgresMapper} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresMapper.js'
import {assertObjectListsAreEqualsInAnyOrder} from '../AssertObjectListsAreEqualsInAnyOrder.js'

export function assertAllRowsAreEqualToUsers(rows: UserRow[], users: User[]) {
    const userRows = rows.map(new UserPostgresMapper().rowToUser)
    assertObjectListsAreEqualsInAnyOrder(userRows, users)
}