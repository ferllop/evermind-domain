import { CardController } from '../controllers/CardController.js'

export class UpdateCardUseCase {
    /**
     * @param {object} dto 
     * @returns {object}
     */
    execute(dto) {
        return new CardController().updateCard(dto)
    }
}
