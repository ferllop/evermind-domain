import { CardController } from '../controllers/CardController.js'

export class CreateCardUseCase {
    /**
     * @param {object} dto 
     * @returns {object}
     */
    execute(dto) {
        return new CardController().storeCard(dto)
    }
}
