import {givenAnExistingUser} from '../user/UserScenario.js'
import {givenAnExistingCard} from '../card/CardScenario.js'
import {SubscriptionBuilder} from '../../../../domain/subscription/SubscriptionBuilder.js'
import {
    SubscriptionPostgresDao,
} from '../../../../../src/implementations/persistence/postgres/subscription/SubscriptionPostgresDao.js'
import {UserIdentification} from '../../../../../src/domain/user/UserIdentification.js'
import {AlwaysAuthorizedAuthorization} from '../../../AlwaysAuthorizedAuthorization.js'

export async function givenAnExistingSubscription() {
    const user = await givenAnExistingUser()
    const card = await givenAnExistingCard()
    const subscription = new SubscriptionBuilder().withUserId(user.getId()).withCardId(card.getId()).build()
    await new SubscriptionPostgresDao(new AlwaysAuthorizedAuthorization()).insert(subscription)
    return subscription
}

export async function givenAnExistingSubscriptionFromUserId(id: UserIdentification) {
    const card = await givenAnExistingCard()
    const subscription = new SubscriptionBuilder().withUserId(id).withCardId(card.getId()).build()
    await new SubscriptionPostgresDao(new AlwaysAuthorizedAuthorization()).insert(subscription)
    return subscription
}