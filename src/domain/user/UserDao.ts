import {User} from './User.js'
import {UserIdentification} from './UserIdentification.js'
import {Username} from './Username.js'
import {StoredUser} from './StoredUser.js'

export interface UserDao {
    insert(user: User): Promise<StoredUser>

    delete(id: StoredUser): Promise<void>

    update(user: StoredUser): Promise<void>

    findById(id: UserIdentification): Promise<StoredUser>

    findByUsername(username: Username): Promise<StoredUser>
}