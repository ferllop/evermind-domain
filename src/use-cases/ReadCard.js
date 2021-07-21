import { CardController } from '../controllers/CardController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'

export class ReadCardUseCase {
    /**
     * @param {string} id 
     */
    execute(id) {
        if (!id) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        return new CardController().retrieveCard(id)
    }
}
