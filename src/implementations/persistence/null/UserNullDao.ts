import {UserDao} from '../../../domain/user/UserDao.js'
import {User} from '../../../domain/user/User.js'

export class UserNullDao implements UserDao {
    delete(): Promise<void> {
        throw new Error('Method not implemented')
    }

    findById(): Promise<User> {
        throw new Error('Method not implemented')
    }

    findByUsername(): Promise<User> {
        throw new Error('Method not implemented')
    }

    insert(): Promise<void> {
        throw new Error('Method not implemented')
    }

    update(): Promise<void> {
        throw new Error('Method not implemented')
    }

}