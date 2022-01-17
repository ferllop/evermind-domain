import {User} from './User'
import {UserIdentification} from './UserIdentification'
import {Username} from './Username'

export interface UserDao {
    insert(user: User): Promise<void>

    delete(id: UserIdentification): Promise<void>

    update(user: User): Promise<void>

    findById(id: UserIdentification): Promise<User>

    findByUsername(username: Username): Promise<User>
}