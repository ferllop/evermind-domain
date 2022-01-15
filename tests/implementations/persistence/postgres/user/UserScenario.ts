import {UserBuilder} from "../../../../domain/user/UserBuilder";
import {UserIdentification} from "../../../../../src/domain/user/UserIdentification";
import {UserPostgresDao} from "../../../../../src/implementations/persistence/postgres/user/UserPostgresDao";

export async function givenAnExistingUser() {
    const user = new UserBuilder().setId(UserIdentification.create().getId()).build()
    await new UserPostgresDao().insert(user)
    return user
}