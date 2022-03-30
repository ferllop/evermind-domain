import {SubscriptionDto} from '../../../../domain/subscription/SusbcriptionDto.js'
import {SubscriptionRow} from './SubscriptionRow.js'
import {Subscription} from '../../../../domain/subscription/Subscription.js'
import {SubscriptionFactory} from '../../../../domain/subscription/SubscriptionFactory.js'
import {Authorization} from '../../../../domain/authorization/Authorization.js'

export class SubscriptionPostgresMapper {
    pgSubscriptionMap: Record<string, keyof SubscriptionDto> = {
        id: 'id',
        user_id: 'userId',
        card_id: 'cardId',
        level: 'level',
        last_review: 'lastReview',
    }

    constructor(private authorization: Authorization) {
    }

    rowToSubscription = (row: SubscriptionRow): Subscription => {
        const subscriptionDto = Object.keys(row).reduce((accum, key) => {
            const value = row[key as keyof SubscriptionRow]
            return {
                ...accum,
                [this.pgSubscriptionMap[key]]: value,
            }

        }, {})

        return new SubscriptionFactory(this.authorization).fromDto(subscriptionDto as SubscriptionDto)
    }
}