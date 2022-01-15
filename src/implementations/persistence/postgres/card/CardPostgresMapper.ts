import {CardDto} from "../../../../domain/card/CardDto";
import {Card} from "../../../../domain/card/Card";
import {CardMapper} from "../../../../domain/card/CardMapper";
import {CardRow} from "./CardRow";

export class CardPostgresMapper {
    pgCardMap: Record<string, keyof CardDto> = {
        id: 'id',
        author_id: 'authorID',
        question: 'question',
        answer: 'answer',
        labelling: 'labelling',
    }

    rowToCard = (row: CardRow): Card => {
        const cardDto = Object.keys(row).reduce((accum, key) => {
            const value = row[key as keyof CardRow]
            return {
                ...accum,
                [this.pgCardMap[key]]: value
            }

        }, {})

        return new CardMapper().fromDto(cardDto as CardDto)
    }
}