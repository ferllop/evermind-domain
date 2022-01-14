import {Card} from "../../../../src/domain/card/Card";
import {assert} from "../../../test-config";
import {CardRow} from "../../../../src/implementations/persistence/postgres/CardRow";
import {CardPostgresMapper} from "../../../../src/implementations/persistence/postgres/CardPostgresMapper";

export function assertCardsAreEqualsInAnyOrder(cardsA: Card[], cardsB: Card[]) {
    assert.ok(
        cardsA
            .map(found => JSON.stringify(found))
            .every(found => cardsB.map(card => JSON.stringify(card)).includes(found)))
}

export function assertAllRowsAreEqualToCards(rows: CardRow[], cards: Card[]) {
    const cardRows = rows.map(new CardPostgresMapper().rowToCard)
    assertCardsAreEqualsInAnyOrder(cardRows, cards)
}