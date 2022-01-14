import {CardPostgresMapper} from "../../../../src/implementations/persistence/postgres/CardPostgresMapper";
import {Card} from "../../../../src/domain/card/Card";

export class CardPostgresMapperTestHelper extends CardPostgresMapper {
    cardToRow = (card: Card) => {
        const {authorID, ...rest} = card.toDto()
        return {
            ...rest,
            author_id: authorID,
        }
    }
}