import {MayBeIdentified} from '../shared/value/MayBeIdentified.js'
import {Level} from './Level.js'
import {Subscription} from './Subscription.js'
import {SubscriptionDto} from './SusbcriptionDto.js'
import {SubscriptionIdentification} from './SubscriptionIdentification.js'
import {Validator} from '../shared/Validator.js'
import {UserIdentification} from '../user/UserIdentification.js'
import {CardIdentification} from '../card/CardIdentification.js'
import {DateEvermind} from '../shared/value/DateEvermind.js'
import {EntityFactory} from '../shared/EntityFactory'

export class SubscriptionMapper extends EntityFactory<Subscription, SubscriptionDto> {
    getValidators(): Map<string, Validator> {
        return new Map()
            .set('id', SubscriptionIdentification.isValid)
            .set('userId', UserIdentification.isValid)
            .set('cardId', CardIdentification.isValid)
            .set('level', Level.isValid)
            .set('lastReview', DateEvermind.isISOString)
    }
    
    isDtoValid(dto: MayBeIdentified<SubscriptionDto>): boolean {
        return Subscription.isValid(dto.userId, dto.cardId, dto.level, dto.lastReview)
    }

    fromDto(dto: SubscriptionDto): Subscription {
        const userId = new UserIdentification(dto.userId)
        const cardId = new CardIdentification(dto.cardId)
        const subscriptionId = new SubscriptionIdentification(dto.id)
        return Subscription.recreate(
            subscriptionId,
            userId, 
            cardId, 
            Level.getByOrdinal(dto.level), 
            new DateEvermind(dto.lastReview)
        )
    }

}
