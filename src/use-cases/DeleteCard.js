import { CardController } from '../controllers/CardController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'

export class DeleteCardUseCase {
    /**
     * @param {object} dto 
     * @returns {object}
     */
    execute(dto) {
        return new CardController().deleteCard(dto)
    }
}
