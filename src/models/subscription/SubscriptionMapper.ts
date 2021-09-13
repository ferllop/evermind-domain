import { DateEvermind } from '../../helpers/DateEvermind.js';
import { Mapper } from '../Mapper.js';
import { MayBeIdentified } from '../value/MayBeIdentified.js';
import { Identification } from '../value/Identification.js';
import { Level } from './Level.js';
import { Subscription } from './Subscription.js';
import { SubscriptionDto } from './SusbcriptionDto.js';
import { SubscriptionIdentification } from './SubscriptionIdentification.js';

export class SubscriptionMapper implements Mapper<Subscription, SubscriptionDto> {
    isDtoValid(dto: MayBeIdentified<SubscriptionDto>): boolean {
        return Subscription.isValid(dto.userId, dto.cardId, dto.level, dto.lastReview)
    }

    fromDto(dto: SubscriptionDto): Subscription {
        const userId = new Identification(dto.userId)
        const cardId = new Identification(dto.cardId)
        return Subscription.recreate(
            new SubscriptionIdentification(userId, cardId),
            userId, 
            cardId, 
            Level.getByOrdinal(dto.level), 
            new DateEvermind(dto.lastReview)
        )
    }

    toDto(subscription: Subscription): SubscriptionDto {
        return {
            id: subscription.getId().getId(),
            userId: subscription.getUserID().getId(),
            cardId: subscription.getCardID().getId(),
            level: subscription.getLevel().getOrdinal(),
            lastReview: subscription.getLastReview().toDtoFormat()
        }
    }


}
