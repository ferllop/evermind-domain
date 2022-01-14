import {UserBuilder} from "../../../domain/user/UserBuilder";
import {UserIdentification} from "../../../../src/domain/user/UserIdentification";
import {UserDao} from "../../../../src/implementations/persistence/postgres/UserDao";

export async function givenAnExistingUser() {
    const user = new UserBuilder().setId(UserIdentification.create().getId()).build()
    await new UserDao().add(user)
    return user
}