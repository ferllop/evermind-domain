import { DateEvermind } from '../../helpers/DateEvermind.js';
import { Mapper } from '../../storage/storables/Mapper.js';
import { MayBeIdentified } from '../../storage/storables/MayBeIdentified.js';
import { Identification } from '../value/Identification.js';
import { Level } from './Level.js';
import { NewSubscriptionDto } from './NewSubscriptionDto.js';
import { Subscription } from './Subscription.js';
import { SubscriptionDto } from './SusbcriptionDto.js';

export class SubscriptionMapper implements Mapper<Subscription, SubscriptionDto> {
    isDtoValid(dto: MayBeIdentified<SubscriptionDto>): boolean {
        return Subscription.isValid(dto.userId, dto.cardId, dto.level, dto.lastReview)
    }

    fromDto(dto: SubscriptionDto|NewSubscriptionDto): Subscription {
        if (this.isNewSubscription(dto)) {
            return new Subscription(
                Identification.create(),
                new Identification(dto.userId), 
                new Identification(dto.cardId), 
                Level.LEVEL_0, 
                DateEvermind.fromDate(new Date())
            )
        }
        const existingSubscription = dto as SubscriptionDto
        return new Subscription(
            new Identification(existingSubscription.id),
            new Identification(existingSubscription.userId), 
            new Identification(existingSubscription.cardId), 
            Level.getByOrdinal(existingSubscription.level), 
            new DateEvermind(existingSubscription.lastReview)
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

    isNewSubscription(dto: SubscriptionDto | NewSubscriptionDto) {
        return Object.keys(dto).some(key => key !== 'userId' && key !== 'cardId')
    }

}
