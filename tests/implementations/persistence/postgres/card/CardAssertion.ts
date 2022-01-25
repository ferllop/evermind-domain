import {Card} from '../../../../../src/domain/card/Card.js'
import {CardRow} from '../../../../../src/implementations/persistence/postgres/card/CardRow.js'
import {CardPostgresMapper} from '../../../../../src/implementations/persistence/postgres/card/CardPostgresMapper.js'
import {assertObjectListsAreEqualsInAnyOrder} from '../AssertObjectListsAreEqualsInAnyOrder.js'

export function assertAllRowsAreEqualToCards(rows: CardRow[], cards: Card[]) {
    const cardRows = rows.map(new CardPostgresMapper().rowToCard)
    assertObjectListsAreEqualsInAnyOrder(cardRows, cards)
}