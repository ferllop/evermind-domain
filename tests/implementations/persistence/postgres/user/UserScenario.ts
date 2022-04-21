import {UserBuilder} from '../../../../domain/user/UserBuilder.js'
import {UserIdentification} from '../../../../../src/domain/user/UserIdentification.js'
import {UserPostgresDao} from '../../../../../src/implementations/persistence/postgres/user/UserPostgresDao.js'
import {User} from '../../../../../src/domain/user/User.js'

export async function givenAnExistingUser() {
    const user = new UserBuilder().setId(UserIdentification.create().getValue()).build()
    return await new UserPostgresDao().insert(user)
}

export async function givenTheExistingUser(user: User) {
    await new UserPostgresDao().insert(user)
    return user
}