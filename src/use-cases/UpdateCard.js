import { CardController } from '../controllers/CardController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'
import { CardMapper } from '../storage/storables/CardMapper.js'

export class UpdateCardUseCase {
    /**
     * @param {string} id 
     * @param {object} dto 
     */
    execute(id, dto) {
        if (!Boolean(id) || !CardMapper.isDtoValid(dto)) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        return new CardController().updateCard(id, dto)
    }
}
