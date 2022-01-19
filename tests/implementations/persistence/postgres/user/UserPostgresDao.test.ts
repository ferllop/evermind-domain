import {assert, suite} from '../../../../test-config.js'
import {PostgresDatastoreMock} from '../PostgresDatastoreMock'
import {UserPostgresDao} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresDao'
import {UserIdentification} from '../../../../../src/domain/user/UserIdentification'
import {UserBuilder} from '../../../../domain/user/UserBuilder'
import {DomainError} from '../../../../../src/domain/errors/DomainError'
import {ErrorType} from '../../../../../src/domain/errors/ErrorType'
import {QueryResultBuilder} from '../QueryResultBuilder'
import {UserRow} from '../../../../../src/implementations/persistence/postgres/user/UserRow'
import {UserPostgresMapperTestHelper} from './UserPostgresMapperTestHelper'
import {assertObjectListsAreEqualsInAnyOrder} from '../AssertObjectListsAreEqualsInAnyOrder'
import {PostgresErrorType} from '../../../../../src/implementations/persistence/postgres/PostgresErrorType'

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
    mock.throwError({code: PostgresErrorType.NOT_UNIQUE_FIELD})
    const id = UserIdentification.create().getId()
    const user = new UserBuilder().setId(id).build()
    try {
        await sut.insert(user)
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.USER_ALREADY_EXISTS)
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
        await sut.delete(UserIdentification.create())
        assert.unreachable()
    } catch (error) {
        if (error instanceof DomainError) {
            assert.is(error.getCode(), ErrorType.USER_NOT_FOUND)
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
            assert.is(error.getCode(), ErrorType.USER_NOT_FOUND)
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
