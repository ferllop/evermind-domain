import {User} from './User.js'
import {UserIdentification} from './UserIdentification.js'
import {Username} from './Username.js'
import {Email} from './Email.js'

export interface UserDao {
    insert(user: User): Promise<void>

    delete(id: UserIdentification): Promise<void>

    update(user: User): Promise<void>

    findById(id: UserIdentification): Promise<User>

    findByUsername(username: Username): Promise<User>

    findByEmail(email: Email): Promise<User>
}