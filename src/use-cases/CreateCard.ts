import { CardController } from '../controllers/CardController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardDto } from '../models/card/CardDto.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Unidentified } from '../storage/datastores/Unidentified.js'
import { Card } from '../models/card/Card.js'
import { AuthorIdentification } from '../models/card/AuthorIdentification.js'
import { WrittenQuestion } from '../models/card/WrittenQuestion.js'
import { WrittenAnswer } from '../models/card/WrittenAnswer.js'
import { Labelling } from '../models/card/Labelling.js'

export class CreateCardUseCase {

    execute(dto: Unidentified<CardDto>, datastore: Datastore): Response<null> {
        const mapper = new CardMapper()
        if (!mapper.isDtoValid(dto)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const card = Card.create(
            new AuthorIdentification(dto.authorID),
            new WrittenQuestion(dto.question),
            new WrittenAnswer(dto.answer),
            new Labelling(dto.labelling)
        )

        const error = new CardController().storeCard(card, datastore)
        return new Response(error.getType(), null)
    }

}
