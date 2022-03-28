import {CardPostgresDao} from './postgres/card/CardPostgresDao.js'
import {CardInMemoryDao} from './in-memory/CardInMemoryDao.js'
import {UserPostgresDao} from './postgres/user/UserPostgresDao.js'
import {UserInMemoryDao} from './in-memory/UserInMemoryDao.js'
import {SubscriptionPostgresDao} from './postgres/subscription/SubscriptionPostgresDao.js'
import {SubscriptionInMemoryDao} from './in-memory/SubscriptionInMemoryDao.js'
import {PersistenceType} from './PersistenceType.js'
import {Config} from '../Config.js'
import {PersistenceMethodNotDeclaredError} from '../../domain/errors/PersistenceMethodNotDeclaredError.js'
import {PermissionInMemoryDao} from './in-memory/PermissionInMemoryDao.js'
import {PermissionPostgresDao} from './postgres/permission/PermissionPostgresDao.js'
import {Authorization} from '../../domain/authorization/Authorization.js'

export class PersistenceFactory {

    static getCardDao(authorization: Authorization) {
        switch (Config.persistenceType) {
            case 'postgres':
                return new CardPostgresDao(authorization)
            case 'memory':
                return new CardInMemoryDao(authorization)
            default:
                throw new PersistenceMethodNotDeclaredError()
        }
    }

    static getUserDao() {
        switch (Config.persistenceType) {
            case 'postgres':
                return new UserPostgresDao()
            case 'memory':
                return new UserInMemoryDao()
            default:
                throw new PersistenceMethodNotDeclaredError()
        }
    }

    static getSubscriptionDao() {
        switch (Config.persistenceType) {
            case 'postgres':
                return new SubscriptionPostgresDao()
            case 'memory':
                return new SubscriptionInMemoryDao()
            default:
                throw new PersistenceMethodNotDeclaredError()
        }
    }

    static getPermissionDao() {
        switch (Config.persistenceType) {
            case 'postgres':
                return new PermissionPostgresDao()
            case 'memory':
                return new PermissionInMemoryDao()
            default:
                throw new PersistenceMethodNotDeclaredError()
        }
    }

    static setType(type: PersistenceType) {
        Config.persistenceType = type ?? undefined
    }
}
