import {Card} from "../../../../../src/domain/card/Card";
import {CardRow} from "../../../../../src/implementations/persistence/postgres/card/CardRow";
import {CardPostgresMapper} from "../../../../../src/implementations/persistence/postgres/card/CardPostgresMapper";
import {assertObjectListsAreEqualsInAnyOrder} from "../AssertObjectListsAreEqualsInAnyOrder";

export function assertAllRowsAreEqualToCards(rows: CardRow[], cards: Card[]) {
    const cardRows = rows.map(new CardPostgresMapper().rowToCard)
    assertObjectListsAreEqualsInAnyOrder(cardRows, cards)
}