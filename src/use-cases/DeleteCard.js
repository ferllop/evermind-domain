import { CardController } from '../controllers/CardController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'

export class DeleteCardUseCase {
    /**
     * @param {string} id 
     */
    execute(id) {
        if (!id) {
            throw new DomainError(ErrorType.DATA_FROM_USE_CASE_NOT_VALID)
        }

        return new CardController().deleteCard(id)
    }
}
