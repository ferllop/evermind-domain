import { CardController } from '../controllers/CardController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'

import '../models/card/CardDto.js'
import { CardMapper } from '../storage/storables/CardMapper.js'

export class CreateCardUseCase {
    /**
     * @param {object} dto 
     * @returns {string}
     */
    execute(dto) {
        if (!CardMapper.isDtoValid(dto)) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        return new CardController().storeCard(dto)
    }
}
