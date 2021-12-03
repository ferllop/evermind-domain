import { DateISO } from '../shared/value/DateISO.js';
import { Level } from './Level.js';
import { SubscriptionIdentification } from './SubscriptionIdentification.js';
import { Subscription } from './Subscription.js';
import { UserIdentification } from '../user/UserIdentification.js';
import { CardIdentification } from '../card/CardIdentification.js';
import { DateEvermind } from '../shared/value/DateEvermind.js';

export class NullSubscription extends Subscription {
    private static instance = null

    private constructor() {
        super(
            new SubscriptionIdentification(UserIdentification.NULL, CardIdentification.NULL), 
            UserIdentification.NULL, 
            CardIdentification.NULL, 
            new Level(0), 
            new DateEvermind(new Date().toISOString() as DateISO)
        )
    }

    static getInstance() {
        return this.instance ?? new NullSubscription()
    }

    override isNull() {
        return true
    }

}
