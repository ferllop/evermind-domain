import {assert, suite} from '../../../../test-config.js'
import {UserSqlQuery} from '../../../../../src/implementations/persistence/postgres/user/UserSqlQuery.js'
import {assertQueriesAreEqual} from '../AssertQueriesAreEqual.js'
import {
    UserPostgresDatastore,
} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresDatastore.js'
import {UserBuilder} from '../../../../domain/user/UserBuilder.js'
import {UserFactory} from '../../../../../src/domain/user/UserFactory.js'
import {assertAllRowsAreEqualToUsers} from './AssertAllRowsAreEqualToUsers.js'
import {UserIdentification} from '../../../../../src/domain/user/UserIdentification.js'
import {givenAnExistingUser} from './UserScenario.js'
import {Username} from '../../../../../src/domain/user/Username.js'
import {cleanDatabase} from '../PostgresTestHelper.js'
import {Identification} from '../../../../../src/domain/shared/value/Identification.js'
import {StoredUser} from '../../../../../src/domain/user/StoredUser.js'

const userSqlQuery = suite('User Sql Query')

userSqlQuery.before.each(async () => await cleanDatabase())

userSqlQuery('should provide the correct insert query', async () => {
    const user = new UserBuilder().build()
    const entity = new StoredUser(user, Identification.create())
    const {id, name, username, dayStartTime} = entity.toDto()

    const sut = new UserSqlQuery().insert(entity)

    const expectedQuery = `INSERT INTO users(id,
                                             name,
                                             username,
                                             day_start_time)
                           VALUES ('${id}',
                                   '${name}',
                                   '${username}',
                                   ${dayStartTime})`
    assertQueriesAreEqual(sut, expectedQuery)
})

userSqlQuery('should provide a working insert user query', async () => {
    const user = new UserBuilder().build()
    const entity = new StoredUser(user, user.getId())
    const sut = new UserSqlQuery().insert(entity)

    await new UserPostgresDatastore().query(sut)
    const storedUsers = await new UserPostgresDatastore().query('SELECT * FROM users')
    assert.equal(storedUsers.rowCount, 1)
    assertAllRowsAreEqualToUsers(storedUsers.rows, [user])
})

userSqlQuery('should provide the correct query to delete the provided user', async () => {
    const user = new UserBuilder().build()
    const sut = new UserSqlQuery().delete(user)
    const expectedQuery = `DELETE
                           FROM users
                           WHERE id = '${user.getId().getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

userSqlQuery('should provide a working delete user query', async () => {
    const user = await givenAnExistingUser()
    const sut = new UserSqlQuery().delete(user)
    const getStoredUsers = async () => new UserPostgresDatastore().query('SELECT * FROM users')
    assert.equal((await getStoredUsers()).rowCount, 1, 'User exists')
    await new UserPostgresDatastore().query(sut)
    assert.equal((await getStoredUsers()).rowCount, 0)
})

userSqlQuery('should provide the correct user update query', async () => {
    const user = new UserBuilder().build()
    const entity = new StoredUser(user, Identification.create())
    const sut = new UserSqlQuery().update(entity)
    const expectedQuery = `UPDATE users
                           SET name           = '${user.getName().getValue()}',
                               username       = '${user.getUsername().getValue()}',
                               day_start_time = ${user.getDayStartTime().getValue()}
                           WHERE id = '${entity.getId().getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

userSqlQuery('should provide a working user update query', async () => {
    const user = await givenAnExistingUser()
    const updatedUser = new UserFactory().fromDto({
        ...user.toDto(),
        name: 'updated name',
        username: 'updated username',
    })

    const sut = new UserSqlQuery().update(updatedUser)

    await new UserPostgresDatastore().query(sut)
    const storedUsers = await new UserPostgresDatastore().query(new UserSqlQuery().selectUserById(user.getId()))
    assertAllRowsAreEqualToUsers(storedUsers.rows, [updatedUser])
})

userSqlQuery('should send the proper query to find a user by id', async () => {
    const userId = UserIdentification.create()
    const sut = new UserSqlQuery().selectUserById(userId)
    const expectedQuery = `SELECT id, name, username, day_start_time
                           FROM users
                           WHERE id = '${userId.getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

userSqlQuery('should send a working query to find a user by id', async () => {
    const user = await givenAnExistingUser()

    const sut = new UserSqlQuery().selectUserById(user.getId())

    const foundUser = await new UserPostgresDatastore().query(sut)

    assert.equal(foundUser.rowCount, 1)
    assertAllRowsAreEqualToUsers(foundUser.rows, [user])
})

userSqlQuery('should send the proper query to find a user by username', async () => {
    const username = new Username('the-username')
    const sut = new UserSqlQuery().selectUserByUsername(username)
    const expectedQuery = `SELECT id, name, username, day_start_time
                           FROM users
                           WHERE username = '${username.getValue()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

userSqlQuery('should send a working query to find a user by username', async () => {
    const user = await givenAnExistingUser()

    const sut = new UserSqlQuery().selectUserByUsername(user.getUsername())

    const foundUser = await new UserPostgresDatastore().query(sut)

    assert.equal(foundUser.rowCount, 1)
    assertAllRowsAreEqualToUsers(foundUser.rows, [user])
})

userSqlQuery.run()


