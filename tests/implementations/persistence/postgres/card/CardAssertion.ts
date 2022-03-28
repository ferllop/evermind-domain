import {Card} from '../../../../../src/domain/card/Card.js'
import {CardRow} from '../../../../../src/implementations/persistence/postgres/card/CardRow.js'
import {CardPostgresMapper} from '../../../../../src/implementations/persistence/postgres/card/CardPostgresMapper.js'
import {assertObjectListsAreEqualsInAnyOrder} from '../AssertObjectListsAreEqualsInAnyOrder.js'
import {AlwaysAuthorizedAuthorization} from '../../../AlwaysAuthorizedAuthorization.js'

export function assertAllRowsAreEqualToCards(rows: CardRow[], cards: Card[]) {
    const authorization = new AlwaysAuthorizedAuthorization()
    const cardRows = rows.map(new CardPostgresMapper(authorization).rowToCard)
    assertObjectListsAreEqualsInAnyOrder(cardRows, cards)
}