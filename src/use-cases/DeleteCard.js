import { CardController } from '../controllers/CardController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'

export class DeleteCardUseCase {
    /**
     * @param {Identified} dto 
     * @param {Datastore} datastore
     * @returns {Response<null>}
     */
    execute(dto, datastore) {
        return new CardController().deleteCard(dto, datastore)
    }
}
