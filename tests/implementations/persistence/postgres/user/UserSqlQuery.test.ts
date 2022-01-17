import {assert, suite} from '../../../../test-config.js'
import {UserSqlQuery} from '../../../../../src/implementations/persistence/postgres/user/UserSqlQuery'
import {assertQueriesAreEqual} from '../AssertQueriesAreEqual'
import {
    UserPostgresDatastore,
} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresDatastore'
import {UserBuilder} from '../../../../domain/user/UserBuilder'
import {UserMapper} from '../../../../../src/domain/user/UserMapper'
import {assertAllRowsAreEqualToUsers} from './AssertAllRowsAreEqualToUsers'
import {UserIdentification} from '../../../../../src/domain/user/UserIdentification'
import {givenAnExistingUser} from './UserScenario'
import {Username} from '../../../../../src/domain/user/Username'

const userSqlQuery = suite('User Sql Query')

userSqlQuery.before.each(async () => {
    const postgresDatastore = new UserPostgresDatastore()
    try {
        await postgresDatastore.query('DROP TABLE IF EXISTS labelling; DROP TABLE IF EXISTS cards; DROP TABLE IF EXISTS users;' +
            new UserSqlQuery().createUsersTable() + ';')
    } catch (error) {
        console.log('ERROR:', error)
    }
})

userSqlQuery('should provide the correct insert query', async () => {
    const user = new UserBuilder().build()
    const {id, name, username, dayStartTime} = new UserMapper().toDto(user)

    const sut = new UserSqlQuery().insert(user)

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

    const sut = new UserSqlQuery().insert(user)

    await new UserPostgresDatastore().query(sut)
    const storedUsers = await new UserPostgresDatastore().query('SELECT * FROM users')
    assert.equal(storedUsers.rowCount, 1)
    assertAllRowsAreEqualToUsers(storedUsers.rows, [user])
})

userSqlQuery('should provide the correct query to delete the provided card', async () => {
    const id = UserIdentification.create()
    const sut = new UserSqlQuery().delete(id)
    const expectedQuery = `DELETE
                           FROM users
                           WHERE id = '${id.getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

userSqlQuery('should provide a working delete user query', async () => {
    const user = await givenAnExistingUser()

    const sut = new UserSqlQuery().delete(user.getId())

    const getStoredUsers = async () => new UserPostgresDatastore().query('SELECT * FROM users')
    assert.equal((await getStoredUsers()).rowCount, 1, 'User exists')
    await new UserPostgresDatastore().query(sut)
    assert.equal((await getStoredUsers()).rowCount, 0)
})

userSqlQuery('should provide the correct user update query', async () => {
    const user = new UserBuilder().build()
    const sut = new UserSqlQuery().update(user)
    const expectedQuery = `UPDATE users
                           SET name           = '${user.getName().getValue()}',
                               username       = '${user.getUsername().getValue()}',
                               day_start_time = ${user.getDayStartTime().getValue()}
                           WHERE id = '${user.getId().getId()}'`
    assertQueriesAreEqual(sut, expectedQuery)
})

userSqlQuery('should provide a working user update query', async () => {
    const user = await givenAnExistingUser()
    const updatedUser = new UserMapper().fromDto({
        ...new UserMapper().toDto(user),
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


