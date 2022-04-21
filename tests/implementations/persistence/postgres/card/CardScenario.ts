import {givenAnExistingUser} from '../user/UserScenario.js'
import {CardBuilder} from '../../../../domain/card/CardBuilder.js'
import {Labelling} from '../../../../../src/domain/card/Labelling.js'
import {CardPostgresDao} from '../../../../../src/implementations/persistence/postgres/card/CardPostgresDao.js'
import {CardIdentification} from '../../../../../src/domain/card/CardIdentification.js'
import {AlwaysAuthorizedAuthorization} from '../../../AlwaysAuthorizedAuthorization.js'

export async function givenTheExistingCardWithId(id: CardIdentification) {
    const user = await givenAnExistingUser()

    const card = new CardBuilder()
        .setId(id)
        .setAuthorId(user.getId())
        .build()
    const authorization = new AlwaysAuthorizedAuthorization()
    await new CardPostgresDao(authorization).insert(card)
    return card
}

export async function givenTheExistingCardWithLabels(...labels: string[]) {
    const user = await givenAnExistingUser()

    const card = new CardBuilder()
        .setAuthorId(user.getId())
        .setLabelling(Labelling.fromStringLabels(labels))
        .build()
    const authorization = new AlwaysAuthorizedAuthorization()
    await new CardPostgresDao(authorization).insert(card)
    return card
}

export async function givenAnExistingCard() {
    const user = await givenAnExistingUser()
    const card = new CardBuilder()
        .setAuthorId(user.getId())
        .build()
    const authorization = new AlwaysAuthorizedAuthorization()
    await new CardPostgresDao(authorization).insert(card)
    return card
}

export async function givenSomeExistingCardsFromSameUser(quantity: number) {
    const user = await givenAnExistingUser()
    for (let i = 0; i < quantity; i++) {
        const card = new CardBuilder()
            .setAuthorId(user.getId())
            .build()
        const authorization = new AlwaysAuthorizedAuthorization()
        await new CardPostgresDao(authorization).insert(card)
    }
    return user
}