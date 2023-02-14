import {DateISO} from 'evermind-types'

export type SubscriptionRow = {
    id: string;
    user_id: string;
    card_id: string;
    level: number;
    last_review: DateISO;
}