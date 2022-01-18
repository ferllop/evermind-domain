import {SubscriptionDto} from '../../../../domain/subscription/SusbcriptionDto'
import {SubscriptionRow} from './SubscriptionRow'
import {Subscription} from '../../../../domain/subscription/Subscription'
import {SubscriptionMapper} from '../../../../domain/subscription/SubscriptionMapper'

export class SubscriptionPostgresMapper {
    pgSubscriptionMap: Record<string, keyof SubscriptionDto> = {
        id: 'id',
        user_id: 'userId',
        card_id: 'cardId',
        level: 'level',
        last_review: 'lastReview',
    }

    rowToSubscription = (row: SubscriptionRow): Subscription => {
        const subscriptionDto = Object.keys(row).reduce((accum, key) => {
            const value = row[key as keyof SubscriptionRow]
            return {
                ...accum,
                [this.pgSubscriptionMap[key]]: value,
            }

        }, {})

        return new SubscriptionMapper().fromDto(subscriptionDto as SubscriptionDto)
    }
}