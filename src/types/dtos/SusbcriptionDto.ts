import { DateISO } from '../types/DateISO.js'

export type SubscriptionDto = {
    id: string;
    userId: string;
    cardId: string;
    level: number;
    lastReview: DateISO;
}
