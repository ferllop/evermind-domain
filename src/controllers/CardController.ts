import { CardRepository } from '../storage/repositories/CardRepository.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Card } from '../models/card/Card.js'
import { DomainError } from '../errors/DomainError.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { CardDto } from '../models/card/CardDto.js'
import { CrudController } from './CrudController.js'
import { CardField } from '../models/card/CardField.js'
import { Unidentified } from '../storage/datastores/Unidentified.js'

export class CardController {

    private crudController() {
        return new CrudController<Card, CardDto>(CardField.TABLE_NAME, new CardMapper())
    }

    storeCard(cardDto: Unidentified<CardDto>, datastore: Datastore): DomainError {
        return this.crudController().store(cardDto, datastore)
    }

    deleteCard(id: Identification, datastore: Datastore): DomainError {
        return this.crudController().delete(id, datastore)
    }

    retrieveCard(id: Identification, datastore: Datastore): DomainError | Card {
        return this.crudController().retrieve(id, datastore)
    }

    updateCard(card: Card, datastore: Datastore): DomainError {
        return this.crudController().update(card, datastore)
    }

    findByLabels(labels: string[], datastore: Datastore): Card[] {
        return new CardRepository(datastore).findByLabels(labels)
    }

    findByAuthorId(authorId: Identification, datastore: Datastore): Card[] {
        return new CardRepository(datastore).findByAuthorId(authorId)
    }

}
