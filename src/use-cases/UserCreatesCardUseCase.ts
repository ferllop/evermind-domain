import {AuthorIdentification} from '../domain/card/AuthorIdentification.js'
import {CardFactory} from '../domain/card/CardFactory.js'
import {Labelling} from '../domain/card/Labelling.js'
import {WrittenAnswer} from '../domain/card/WrittenAnswer.js'
import {WrittenQuestion} from '../domain/card/WrittenQuestion.js'
import {Response} from './Response.js'
import {UserCreatesCardRequest} from './UserCreatesCardRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {CardDto} from '../domain/card/CardDto.js'
import {Id} from '../domain/shared/value/Id.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'

export class UserCreatesCardUseCase extends UseCase<UserCreatesCardRequest & {requesterId: Id}, CardDto> {

    constructor() {
        super(['authorId',
            'question',
            'answer',
            'labelling'])
    }

    protected async internalExecute(request: UserCreatesCardRequest & {requesterId: Id}): Promise<Response<CardDto>> {
        if (!new CardFactory().isDtoValid({...request, authorId: request.authorId})) {
            throw new InputDataNotValidError()
        }

        const {authorId, question, answer, labelling, requesterId} = request
        const card = new CardFactory().create(
            new AuthorIdentification(authorId),
            new WrittenQuestion(question),
            new WrittenAnswer(answer),
            Labelling.fromStringLabels(labelling),
        )
        await new CardRepository().add(card, new RequesterIdentification(requesterId))

        return Response.OkWithData(card.toDto())
    }

}
