import {assertObjectListsAreEqualsInAnyOrder} from '../AssertObjectListsAreEqualsInAnyOrder'
import {SubscriptionRow} from '../../../../../src/implementations/persistence/postgres/subscription/SubscriptionRow'
import {Subscription} from '../../../../../src/domain/subscription/Subscription'
import {
    SubscriptionPostgresMapper,
} from '../../../../../src/implementations/persistence/postgres/subscription/SubscriptionPostgresMapper'

export function assertAllRowsAreEqualToSubscriptions(rows: SubscriptionRow[], subscriptions: Subscription[]) {
    const subscriptionRows = rows.map(new SubscriptionPostgresMapper().rowToSubscription)
    assertObjectListsAreEqualsInAnyOrder(subscriptionRows, subscriptions)
}