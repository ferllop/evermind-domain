import { precondition } from '../../lib/preconditions.js'
import { Card } from '../../models/card/Card.js'

export class CardMapper {
    
    /** 
     * @param {object} dto
     * @returns {boolean} 
     */
    static isDtoValid(dto) {
        return Boolean(dto) && Card.isValid(dto.authorID, dto.question, dto.answer, dto.labelling, dto.id)
    }

    /** 
     * @param {object} dto
     * @returns {Card} 
     */
    static fromDto(dto) {
        precondition(CardMapper.isDtoValid(dto))
        return new Card(dto.authorID, dto.question, dto.answer, dto.labelling, dto.id)
    }

    /**
     * @param {Card} card 
     * @returns {object}
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
