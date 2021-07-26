import { CardController } from '../controllers/CardController.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class ReadCardUseCase {
    /**
     * @param {object} dto 
     * @param {Datastore} datastore
     * @returns {object}
     */
    execute(dto, datastore) {
        return new CardController().retrieveCard(dto, datastore)
    }
}
