import {precondition} from '../../../src/implementations/preconditions.js'
import {assert, suite} from '../../test-config.js'
import {UserFactory} from '../../../src/domain/user/UserFactory.js'
import {UserBuilder} from './UserBuilder.js'
import {CardBuilder} from '../card/CardBuilder.js'
import {SubscriptionBuilder} from '../subscription/SubscriptionBuilder.js'
import {NullSubscription} from '../../../src/domain/subscription/NullSubscription.js'
import {SubscriptionNotFoundError} from '../../../src/domain/errors/SubscriptionNotFoundError.js'
import {PreconditionError} from 'preconditions'

const user = suite('User')

user('should know that valid data is valid', () => {
    const noChanges = {}
    assert.ok(isUserValidWith(noChanges))
})

user('should know that data is invalid when comes with an empty name', () => {
    assert.not.ok(isUserValidWith({name: ''}))
})

user('should know that data is invalid when comes with an empty username', () => {
    assert.not.ok(isUserValidWith({username: ''}))
})

user('given a user ' +
    'when wants to manage its subscriptions,' +
    'must be enforced to retrieve its subscriptions', () => {
    const user = new UserBuilder().build()
    const subscription = new SubscriptionBuilder().withUserId(user.getId()).build()
    assert.throws(() => user.subscribe(subscription), (error: Error) => error instanceof PreconditionError)
})

user('given a user without subscriptions ' +
    'when subscribing to a card, ' +
    'must remain subscribed to the card', () => {
    const user = new UserBuilder().build()
    const card = new CardBuilder().build()
    const subscription = new SubscriptionBuilder()
        .withUserId(user.getId())
        .withCardId(card.getId())
        .build()
    user.subscribedTo([])
    assert.not.ok(user.isSubscribedTo(card))
    user.subscribe(subscription)
    assert.ok(user.isSubscribedTo(card))
})

user('given a user without subscriptions ' +
    'when subscribing to a NullCard, ' +
    'must remain without subscriptions', () => {
    const user = new UserBuilder().build()
    const nullSubscription = NullSubscription.getInstance()
    user.subscribedTo([])
    assert.throws(
        () => user.subscribe(nullSubscription),
        (error: Error) => error instanceof SubscriptionNotFoundError)
})

user.run()

function isUserValidWith(obj: object) {
    precondition(typeof obj === 'object')
    const dto = {...new UserBuilder().buildDto(), ...obj}
    return new UserFactory().isValid(dto.name, dto.username, dto.email, dto.dayStartTime, undefined)
}
