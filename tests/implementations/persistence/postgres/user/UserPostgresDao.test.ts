import {assert, suite} from '../../../../test-config.js'
import {PostgresDatastoreMock} from '../PostgresDatastoreMock.js'
import {UserPostgresDao} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresDao.js'
import {UserIdentification} from '../../../../../src/domain/user/UserIdentification.js'
import {UserBuilder} from '../../../../domain/user/UserBuilder.js'
import {DomainError} from '../../../../../src/domain/errors/DomainError.js'
import {QueryResultBuilder} from '../QueryResultBuilder.js'
import {UserRow} from '../../../../../src/implementations/persistence/postgres/user/UserRow.js'
import {UserPostgresMapperTestHelper} from './UserPostgresMapperTestHelper.js'
import {assertObjectListsAreEqualsInAnyOrder} from '../AssertObjectListsAreEqualsInAnyOrder.js'
import {PostgresErrorType} from '../../../../../src/implementations/persistence/postgres/PostgresErrorType.js'
import {UserNotFoundError} from '../../../../../src/domain/errors/UserNotFoundError.js'
import {UserAlreadyExistsError} from '../../../../../src/domain/errors/UserAlreadyExistsError.js'

type Context = {
    mock: PostgresDatastoreMock,
    sut: UserPostgresDao,
}

const userDao = suite<Context>('User DAO')

userDao.before.each(context => {
    context.mock = new PostgresDatastoreMock()
    context.sut = new UserPostgresDao(context.mock)
})

userDao('should throw a USER_ALREADY_EXISTS error when inserting a user that already exists', async ({mock, sut}) => {
    mock.throwErrorWithCode(PostgresErrorType.NOT_UNIQUE_FIELD)
    const id = UserIdentification.create().getId()
    const user = new UserBuilder().setId(id).build()
    try {
        await sut.insert(user)
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.instance(error, UserAlreadyExistsError)
        } else {
            throw error
        }
    }
})

userDao('should throw a USER_NOT_FOUND error when deleting a non-existing user', async ({mock, sut}) => {
    const deletedUsersCount = 0
    const noDeletedUsersResult = new QueryResultBuilder<UserRow>().withRowCount(deletedUsersCount).build()
    mock.returnResult(noDeletedUsersResult)
    try {
        await sut.delete(new UserBuilder().build())
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.instance(error, UserNotFoundError)
        } else {
            throw error
        }
    }
})

userDao('should throw a USER_NOT_FOUND error when updating a non-existing user', async ({mock, sut}) => {
    const noUpdatedUsersResult = new QueryResultBuilder<UserRow>().withRowCount(0).build()
    mock.returnResult(noUpdatedUsersResult)
    try {
        await sut.update(new UserBuilder().build())
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.instance(error, UserNotFoundError)
        } else {
            throw error
        }
    }
})

userDao('should return the found user when searching by user id', async ({mock, sut}) => {
    const userId = UserIdentification.create()
    const user = new UserBuilder().setId(userId.getId()).build()
    const resultWithFoundUser = new QueryResultBuilder<UserRow>().withRows([new UserPostgresMapperTestHelper().userToRow(user)]).withRowCount(1).build()
    mock.returnResult(resultWithFoundUser)
    const result = await sut.findById(userId)
    assertObjectListsAreEqualsInAnyOrder([result], [user])
})

userDao.run()
