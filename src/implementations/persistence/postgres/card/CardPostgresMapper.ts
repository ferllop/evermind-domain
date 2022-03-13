import {CardDto} from '../../../../domain/card/CardDto.js'
import {Card} from '../../../../domain/card/Card.js'
import {CardFactory} from '../../../../domain/card/CardFactory.js'
import {CardRow} from './CardRow.js'

export class CardPostgresMapper {
    pgCardMap: Record<string, keyof CardDto> = {
        id: 'id',
        author_id: 'authorId',
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

        return new CardFactory().fromDto(cardDto as CardDto)
    }
}