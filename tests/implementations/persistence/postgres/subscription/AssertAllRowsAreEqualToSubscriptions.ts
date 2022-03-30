import {assertObjectListsAreEqualsInAnyOrder} from '../AssertObjectListsAreEqualsInAnyOrder.js'
import {SubscriptionRow} from '../../../../../src/implementations/persistence/postgres/subscription/SubscriptionRow.js'
import {Subscription} from '../../../../../src/domain/subscription/Subscription.js'
import {
    SubscriptionPostgresMapper,
} from '../../../../../src/implementations/persistence/postgres/subscription/SubscriptionPostgresMapper.js'
import {AlwaysAuthorizedAuthorization} from '../../../AlwaysAuthorizedAuthorization.js'

export function assertAllRowsAreEqualToSubscriptions(rows: SubscriptionRow[], subscriptions: Subscription[]) {
    const subscriptionRows = rows.map(new SubscriptionPostgresMapper(new AlwaysAuthorizedAuthorization()).rowToSubscription)
    assertObjectListsAreEqualsInAnyOrder(subscriptionRows, subscriptions)
}