import { DateISO } from '../value/DateISO';

export type SubscriptionDto = {
    id: string;
    userId: string;
    cardId: string;
    level: number;
    lastReview: DateISO;
}
