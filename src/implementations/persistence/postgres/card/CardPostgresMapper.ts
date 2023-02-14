import {CardDto} from '../../../../types/dtos/CardDto.js'
import {Card} from '../../../../domain/card/Card.js'
import {CardFactory} from '../../../../domain/card/CardFactory.js'
import {CardRow} from './CardRow.js'
import {Authorization} from '../../../../domain/authorization/Authorization.js'

export class CardPostgresMapper {
    pgCardMap: Record<string, keyof CardDto> = {
        id: 'id',
        author_id: 'authorId',
        question: 'question',
        answer: 'answer',
        labelling: 'labelling',
        visibility: 'visibility'
    }

    constructor(private authorization: Authorization) {
    }

    rowToCard = (row: CardRow): Card => {
        const cardDto = Object.keys(row).reduce((accum, key) => {
            const value = row[key as keyof CardRow]
            return {
                ...accum,
                [this.pgCardMap[key]]: value
            }

        }, {})

        return new CardFactory(this.authorization).fromDto(cardDto as CardDto)
    }
}