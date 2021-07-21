import { precondition } from '../../lib/preconditions.js'
import { Card } from '../../models/card/Card.js'

export class CardMapper {
    
    /** 
     * @param {object} dto
     * @returns {boolean} 
     */
    static isDtoValid(dto) {
        return dto && Card.isValid(dto.authorID, dto.question, dto.answer, dto.labelling)
    }

    /** 
     * @param {object} dto
     * @returns {Card} 
     */
    static fromDto(dto) {
        precondition(CardMapper.isDtoValid(dto))
        return new Card(dto.authorID, dto.question, dto.answer, dto.labelling)
    }
}
