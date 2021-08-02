import { CardController } from '../controllers/CardController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'

export class ReadCardUseCase {
    /**
     * @param {Identified} dto 
     * @param {Datastore} datastore
     * @returns {Response}
     */
    execute(dto, datastore) {
        return new CardController().retrieveCard(dto, datastore)
    }
}
