import {CardPostgresMapper} from '../../../../../src/implementations/persistence/postgres/card/CardPostgresMapper.js'
import {Card} from '../../../../../src/domain/card/Card.js'
import {AlwaysAuthorizedAuthorization} from '../../../AlwaysAuthorizedAuthorization.js'

export class CardPostgresMapperTestHelper extends CardPostgresMapper {
    cardToRow = (card: Card) => {
        const {authorId, ...rest} = card.toDto()
        return {
            ...rest,
            author_id: authorId,
        }
    }

    constructor() {
        super(new AlwaysAuthorizedAuthorization())
    }
}