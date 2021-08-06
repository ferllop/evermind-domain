import { Level } from '../../../src/models/subscription/Level.js'
import { Subscription } from '../../../src/models/subscription/Subscription.js'
import { assert, suite } from '../../test-config.js'

const subscription = suite('Subscription')

subscription(
    'should know that its to be reviewed now ' +
    'when at least actual hour is equal or more than its nextReview field', () => {
        const now = new Date('Mon Jul 12 2021 10:10:10 GMT+0200')
        const subscriptionForToday = new Subscription('', '', Level.LEVEL_0, new Date(), now)
        assert.ok(subscriptionForToday.isToReviewInDate(10, now))
        assert.ok(subscriptionForToday.isToReviewInDate(9, now))
    })

subscription(
    'should know that its not to be reviewed now' + 
    'when at least actual hour is less than its nextReview field', () => {
    const now = new Date('Mon Jul 12 2021 10:10:10 GMT+0200')
    const subscriptionForToday = new Subscription('', '', Level.LEVEL_0, new Date(), now)
    assert.not.ok(subscriptionForToday.isToReviewInDate(11, now))
})

subscription.run()
