import {givenAnExistingUser} from "../user/UserScenario";
import {CardBuilder} from "../../../../domain/card/CardBuilder";
import {AuthorIdentification} from "../../../../../src/domain/card/AuthorIdentification";
import {Labelling} from "../../../../../src/domain/card/Labelling";
import {CardPostgresDao} from "../../../../../src/implementations/persistence/postgres/card/CardPostgresDao";
import {CardIdentification} from "../../../../../src/domain/card/CardIdentification";

export async function givenTheExistingCardWithId(id: CardIdentification) {
    const user = await givenAnExistingUser()

    const card = new CardBuilder()
        .setId(id)
        .setAuthorID(user.getId() as AuthorIdentification)
        .build()
    await new CardPostgresDao().insert(card)
    return card
}

export async function givenTheExistingCardWithLabels(...labels: string[]) {
    const user = await givenAnExistingUser()

    const card = new CardBuilder()
        .setAuthorID(user.getId() as AuthorIdentification)
        .setLabelling(Labelling.fromStringLabels(labels))
        .build()
    await new CardPostgresDao().insert(card)
    return card
}

export async function givenAnExistingCard() {
    const user = await givenAnExistingUser()
    const card = new CardBuilder()
        .setAuthorID(user.getId() as AuthorIdentification)
        .build()
    await new CardPostgresDao().insert(card)
    return card
}

export async function givenSomeExistingCardsFromSameUser(quantity: number) {
    const user = await givenAnExistingUser()
    for (let i = 0; i < quantity; i++) {
        const card = new CardBuilder()
            .setAuthorID(user.getId() as AuthorIdentification)
            .build()
        await new CardPostgresDao().insert(card)
    }
    return user
}