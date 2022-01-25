import {CardPostgresDao} from './postgres/card/CardPostgresDao.js'
import {CardInMemoryDao} from './in-memory/CardInMemoryDao.js'
import {CardNullDao} from './null/CardNullDao.js'
import {UserPostgresDao} from './postgres/user/UserPostgresDao.js'
import {UserInMemoryDao} from './in-memory/UserInMemoryDao.js'
import {SubscriptionPostgresDao} from './postgres/subscription/SubscriptionPostgresDao.js'
import {SubscriptionInMemoryDao} from './in-memory/SubscriptionInMemoryDao.js'
import {PersistenceType} from './PersistenceType.js'
import {UserNullDao} from './null/UserNullDao.js'
import {SubscriptionNullDao} from './null/SubscriptionNullDao.js'

export class PersistenceFactory {

    private static type: PersistenceType = 'memory'

    static getCardDao() {
        switch (this.type) {
            case 'postgres':
                return new CardPostgresDao()
            case 'memory':
                return new CardInMemoryDao()
        }
        return new CardNullDao()
    }

    static getUserDao() {
        switch (this.type) {
            case 'postgres':
                return new UserPostgresDao()
            case 'memory':
                return new UserInMemoryDao()
        }
        return new UserNullDao()
    }

    static getSubscriptionDao() {
        switch (this.type) {
            case 'postgres':
                return new SubscriptionPostgresDao()
            case 'memory':
                return new SubscriptionInMemoryDao()
        }
        return new SubscriptionNullDao()
    }

    static setType(type: PersistenceType) {
        this.type = type
    }
}
