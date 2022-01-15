import {User} from "./User";
import {UserIdentification} from "./UserIdentification";

export interface UserDao {
    insert(user: User): Promise<void>;

    delete(id: UserIdentification): Promise<void>;

    update(user: User): Promise<void>;

    findById(id: UserIdentification): Promise<User>;
}