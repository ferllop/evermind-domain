import {CardPostgresDao} from './postgres/card/CardPostgresDao'
import {CardInMemoryDao} from './in-memory/CardInMemoryDao'
import {CardNullDao} from './null/CardNullDao'
import {UserPostgresDao} from './postgres/user/UserPostgresDao'
import {UserInMemoryDao} from './in-memory/UserInMemoryDao'
import {SubscriptionPostgresDao} from './postgres/subscription/SubscriptionPostgresDao'
import {SubscriptionInMemoryDao} from './in-memory/SubscriptionInMemoryDao'
import {PersistenceType} from './PersistenceType'
import {UserNullDao} from './null/UserNullDao'
import {SubscriptionNullDao} from './null/SubscriptionNullDao'

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
