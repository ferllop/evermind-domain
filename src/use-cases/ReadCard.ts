import { CardController } from '../controllers/CardController.js'
import { CardDto } from '../models/card/CardDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'

export class ReadCardUseCase {
    execute(dto: Identified, datastore: Datastore): Response<CardDto|null> {
        return new CardController().retrieveCard(dto, datastore)
    }
}
