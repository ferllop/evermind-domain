import {givenAnExistingUser} from '../user/UserScenario'
import {givenAnExistingCard} from '../card/CardScenario'
import {SubscriptionBuilder} from '../../../../domain/subscription/SubscriptionBuilder'
import {
    SubscriptionPostgresDao,
} from '../../../../../src/implementations/persistence/postgres/subscription/SubscriptionPostgresDao'
import {UserIdentification} from '../../../../../src/domain/user/UserIdentification'

export async function givenAnExistingSubscription() {
    const user = await givenAnExistingUser()
    const card = await givenAnExistingCard()
    const subscription = new SubscriptionBuilder().withUserId(user.getId()).withCardId(card.getId()).build()
    await new SubscriptionPostgresDao().insert(subscription)
    return subscription
}

export async function givenAnExistingSubscriptionFromUserId(id: UserIdentification) {
    const card = await givenAnExistingCard()
    const subscription = new SubscriptionBuilder().withUserId(id).withCardId(card.getId()).build()
    await new SubscriptionPostgresDao().insert(subscription)
    return subscription
}