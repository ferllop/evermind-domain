import {DateEvermind} from '../../../src/domain/shared/value/DateEvermind.js'
import {DayStartTime} from '../../../src/domain/shared/value/DayStartTime.js'
import {assert, suite} from '../../test-config.js'
import {SubscriptionBuilder} from './SubscriptionBuilder.js'

const toReview = new Date('Mon Jul 12 2021 10:00:00 GMT+0200')
const subscriptionForToday = new SubscriptionBuilder().setLastReview(DateEvermind.fromDate(toReview)).build()

const subscription = suite('Subscription')

subscription(
    'should know that its not to be reviewed now ' +
    'when now is one second before nextReview field', () => {
        const now = new Date('Mon Jul 12 2021 09:59:59 GMT+0200')
        assert.not.ok(subscriptionForToday.isToReviewInDate(new DayStartTime(10), now))
    })

subscription(
    'should know that its to be reviewed now ' +
    'when actual time is equal to its nextReview field', () => {
        assert.ok(subscriptionForToday.isToReviewInDate(new DayStartTime(10), toReview))
    })


subscription(
    'should know that its to be reviewed now ' +
    'when actual hour is past one second to its nextReview field', () => {
        const now = new Date('Mon Jul 12 2021 10:00:01 GMT+0200')
        assert.ok(subscriptionForToday.isToReviewInDate(new DayStartTime(10), now))
    })


subscription(
    'should know that its to be reviewed now ' +
    'when now is next day of nextReview field', () => {
        const now = new Date('Tue Jul 13 2021 00:00:01 GMT+0200')
        assert.ok(subscriptionForToday.isToReviewInDate(new DayStartTime(10), now))
    })

subscription.run()

