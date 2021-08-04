import { CardController } from '../controllers/CardController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardDto } from '../models/card/CardDto.js'

export class CreateCardUseCase {
    /**
     * @param {CardDto} dto 
     * @param {Datastore} datastore
     * @returns {Response<null>}
     */
    execute(dto, datastore) {
        return new CardController().storeCard(dto, datastore)
    }
}
