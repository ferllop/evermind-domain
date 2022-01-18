import {UserBuilder} from "../../../../domain/user/UserBuilder";
import {UserIdentification} from "../../../../../src/domain/user/UserIdentification";
import {UserPostgresDao} from "../../../../../src/implementations/persistence/postgres/user/UserPostgresDao";
import {User} from '../../../../../src/domain/user/User'

export async function givenAnExistingUser() {
    const user = new UserBuilder().setId(UserIdentification.create().getId()).build()
    await new UserPostgresDao().insert(user)
    return user
}

export async function givenTheExistingUser(user: User) {
    await new UserPostgresDao().insert(user)
    return user
}