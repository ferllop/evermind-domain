import {CardPostgresDao} from './postgres/card/CardPostgresDao.js'
import {CardInMemoryDao} from './in-memory/CardInMemoryDao.js'
import {UserPostgresDao} from './postgres/user/UserPostgresDao.js'
import {UserInMemoryDao} from './in-memory/UserInMemoryDao.js'
import {SubscriptionPostgresDao} from './postgres/subscription/SubscriptionPostgresDao.js'
import {SubscriptionInMemoryDao} from './in-memory/SubscriptionInMemoryDao.js'
import {PersistenceType} from './PersistenceType.js'
import {DomainError} from '../../domain/errors/DomainError.js'
import {ErrorType} from '../../domain/errors/ErrorType.js'
import {Config} from '../Config.js'

export class PersistenceFactory {

    static getCardDao() {
        switch (Config.persistenceType) {
            case 'postgres':
                return new CardPostgresDao()
            case 'memory':
                return new CardInMemoryDao()
            default:
                throw new DomainError(ErrorType.PERSISTENCE_METHOD_NOT_DECLARED)
        }
    }

    static getUserDao() {
        switch (Config.persistenceType) {
            case 'postgres':
                return new UserPostgresDao()
            case 'memory':
                return new UserInMemoryDao()
            default:
                throw new DomainError(ErrorType.PERSISTENCE_METHOD_NOT_DECLARED)
        }
    }

    static getSubscriptionDao() {
        switch (Config.persistenceType) {
            case 'postgres':
                return new SubscriptionPostgresDao()
            case 'memory':
                return new SubscriptionInMemoryDao()
            default:
                throw new DomainError(ErrorType.PERSISTENCE_METHOD_NOT_DECLARED)
        }
    }

    static setType(type: PersistenceType) {
        Config.persistenceType = type ?? undefined
    }
}
