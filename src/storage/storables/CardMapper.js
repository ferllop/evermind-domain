import { precondition } from '../../lib/preconditions.js'
import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'

export class CardMapper {
    
    /** 
     * @param {CardDto} dto
     * @returns {boolean} 
     */
    static isDtoValid(dto) {
        return Boolean(dto) && Card.isValid(dto.authorID, dto.question, dto.answer, dto.labelling, dto.id)
    }

    /** 
     * @param {CardDto} dto
     * @returns {Card} 
     */
    static fromDto(dto) {
        precondition(CardMapper.isDtoValid(dto))
        return new Card(dto.authorID, dto.question, dto.answer, dto.labelling, dto.id)
    }

    /**
     * @param {Card} card 
     * @returns {CardDto}
     */
    static toDto(card) {
        return {
            id: card.getId().toString(),
            authorID: card.getAuthorID().toString(),
            question: card.getQuestion().getQuestion(),
            answer: card.getAnswer().getAnswer(),
            labelling: card.getLabelling().getLabels()
        }
    }
}
